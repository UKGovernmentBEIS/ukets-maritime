package uk.gov.mrtm.api.web.controller.exception;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.temporal.Temporal;
import java.util.Collection;
import java.util.Date;
import java.util.IdentityHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * For external FORM1001: BV/SpEL {@link FieldError}s with {@code []} paths have no numeric index.
 * Walks the bound external request DTO from {@link BindingResult#getTarget()}, matches
 * {@link FieldError#getRejectedValue()} with {@code ==} (not {@code equals()}), and falls back
 * to {@link FieldError#getField()} when nothing matches.
 */
public final class RejectedValueFieldPathResolver {

    static final int MAX_DEPTH = 10;

    private static final String EXTERNAL_INTEGRATION_PACKAGE = "uk.gov.mrtm.api.integration.external";

    private RejectedValueFieldPathResolver() {
    }

    /** Indexed path when {@code field} contains {@code []} and {@code rejectedValue} is set; else {@code field}. */
    public static String resolve(FieldError fieldError, BindingResult bindingResult) {
        String field = fieldError.getField();
        Object rejectedValue = fieldError.getRejectedValue();
        Object target = bindingResult.getTarget();

        if (field == null || rejectedValue == null || target == null || !field.contains("[]")) {
            return field;
        }

        String resolved = findPath(target, rejectedValue, "", 0, new IdentityHashMap<>());
        return resolved != null ? resolved : field;
    }

    /** DFS; match with {@code ==}; {@code visited} ({@link IdentityHashMap}) avoids cycles; bounded by {@link #MAX_DEPTH}. */
    private static String findPath(Object current, Object rejected, String path, int depth,
                                   IdentityHashMap<Object, Boolean> visited) {
        if (current == rejected) {
            return normalizePath(path);
        }
        if (current == null || depth > MAX_DEPTH) {
            return null;
        }
        if (visited.containsKey(current)) {
            return null;
        }
        visited.put(current, Boolean.TRUE);

        Class<?> clazz = current.getClass();
        if (clazz.isArray()) {
            return findPathInArray(current, rejected, path, depth, visited);
        }
        if (current instanceof Collection<?> collection) {
            return findPathInCollection(collection, rejected, path, depth, visited);
        }
        if (shouldSkipTraversing(clazz)) {
            return null;
        }
        return findPathInBean(current, rejected, path, depth, visited);
    }

    private static String findPathInArray(Object array, Object rejected, String path, int depth,
                                          IdentityHashMap<Object, Boolean> visited) {
        int length = Array.getLength(array);
        for (int index = 0; index < length; index++) {
            Object element = Array.get(array, index);
            String elementPath = path + "[" + index + "]";
            String resolved = findPath(element, rejected, elementPath, depth + 1, visited);
            if (resolved != null) {
                return resolved;
            }
        }
        return null;
    }

    private static String findPathInCollection(Collection<?> collection, Object rejected, String path, int depth,
                                               IdentityHashMap<Object, Boolean> visited) {
        int index = 0;
        for (Object element : collection) {
            String elementPath = path + "[" + index + "]";
            String resolved = findPath(element, rejected, elementPath, depth + 1, visited);
            if (resolved != null) {
                return resolved;
            }
            index++;
        }
        return null;
    }

    private static String findPathInBean(Object bean, Object rejected, String path, int depth,
                                         IdentityHashMap<Object, Boolean> visited) {
        try {
            BeanInfo beanInfo = Introspector.getBeanInfo(bean.getClass(), Object.class);
            for (PropertyDescriptor descriptor : beanInfo.getPropertyDescriptors()) {
                String propertyName = descriptor.getName();
                if ("class".equals(propertyName)) {
                    continue;
                }
                Method readMethod = descriptor.getReadMethod();
                if (readMethod == null) {
                    continue;
                }
                Object propertyValue = readMethod.invoke(bean);
                String propertyPath = appendProperty(path, propertyName);
                String resolved = findPath(propertyValue, rejected, propertyPath, depth + 1, visited);
                if (resolved != null) {
                    return resolved;
                }
            }
        } catch (ReflectiveOperationException | java.beans.IntrospectionException ignored) {
            return null;
        }
        return null;
    }

    private static String appendProperty(String path, String propertyName) {
        if (path == null || path.isEmpty()) {
            return propertyName;
        }
        return path + "." + propertyName;
    }

    private static String normalizePath(String path) {
        if (path == null || path.isEmpty()) {
            return path;
        }
        return path.startsWith(".") ? path.substring(1) : path;
    }

    private static boolean isExternalIntegrationType(Class<?> clazz) {
        return clazz != null && clazz.getName().startsWith(EXTERNAL_INTEGRATION_PACKAGE);
    }

    private static boolean shouldSkipTraversing(Class<?> clazz) {
        if (clazz == null || clazz.isPrimitive()) {
            return true;
        }
        if (clazz.isEnum()) {
            return true;
        }
        if (String.class.equals(clazz)
            || Number.class.isAssignableFrom(clazz)
            || Boolean.class.equals(clazz)
            || Character.class.equals(clazz)
            || UUID.class.equals(clazz)
            || BigDecimal.class.equals(clazz)
            || Date.class.isAssignableFrom(clazz)
            || Temporal.class.isAssignableFrom(clazz)
            || Map.class.isAssignableFrom(clazz)) {
            return true;
        }
        return !isExternalIntegrationType(clazz);
    }
}
