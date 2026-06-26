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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * For external FORM1001: indexes Spring {@code []} field paths when {@link FieldError#getRejectedValue()}
 * is {@code null} and the leaf property on the bound graph is {@code null} (e.g. {@code @NotNull}).
 */
public final class NullLeafFieldPathResolver {

    private static final int MAX_DEPTH = 10;

    private static final String EXTERNAL_INTEGRATION_PACKAGE = "uk.gov.mrtm.api.integration.external";

    private static final String NOT_NULL_CODE = "NotNull";

    private NullLeafFieldPathResolver() {
    }

    /**
     * Resolves an indexed path when {@code field} contains {@code []}, {@code rejectedValue} is {@code null},
     * and the violation is a {@code NotNull}-style error. Uses {@code occurrenceCounts} to pick the Nth matching
     * null leaf for duplicate {@code field} paths. Falls back to {@code field} when unresolved.
     */
    public static String resolve(FieldError fieldError, BindingResult bindingResult,
                                 Map<String, Integer> occurrenceCounts) {
        String field = fieldError.getField();
        Object target = bindingResult.getTarget();

        if (field == null || fieldError.getRejectedValue() != null || target == null || !field.contains("[]")) {
            return field;
        }
        if (!isNotNullViolation(fieldError)) {
            return field;
        }

        List<PathSegment> segments = parsePath(field);
        if (segments.isEmpty() || segments.get(segments.size() - 1) instanceof IndexedCollection) {
            return field;
        }

        int occurrenceToSkip = occurrenceCounts.getOrDefault(field, 0);
        MatchCounter counter = new MatchCounter(occurrenceToSkip);
        String resolved = findNullLeafPath(target, segments, 0, "", 0, counter, new IdentityHashMap<>());
        if (resolved != null) {
            occurrenceCounts.put(field, occurrenceToSkip + 1);
            return resolved;
        }
        return field;
    }

    private static String findNullLeafPath(Object current, List<PathSegment> segments, int segmentIndex,
                                           String path, int depth, MatchCounter counter,
                                           IdentityHashMap<Object, Boolean> visited) {
        if (current == null || depth > MAX_DEPTH || segmentIndex >= segments.size()) {
            return null;
        }

        PathSegment segment = segments.get(segmentIndex);
        if (segment instanceof Property property) {
            if (segmentIndex == segments.size() - 1) {
                return matchNullLeafProperty(current, property.name(), path, counter);
            }
            Object next = readProperty(current, property.name());
            String nextPath = appendProperty(path, property.name());
            return findNullLeafPath(next, segments, segmentIndex + 1, nextPath, depth + 1, counter, visited);
        }

        if (segment instanceof IndexedCollection) {
            if (visited.containsKey(current)) {
                return null;
            }
            visited.put(current, Boolean.TRUE);

            if (current.getClass().isArray()) {
                return findNullLeafInArray(current, segments, segmentIndex, path, depth, counter, visited);
            }
            if (current instanceof Collection<?> collection) {
                return findNullLeafInCollection(collection, segments, segmentIndex, path, depth, counter, visited);
            }
            return null;
        }

        return null;
    }

    private static String findNullLeafInArray(Object array, List<PathSegment> segments, int segmentIndex,
                                              String path, int depth, MatchCounter counter,
                                              IdentityHashMap<Object, Boolean> visited) {
        int length = Array.getLength(array);
        for (int index = 0; index < length; index++) {
            Object element = Array.get(array, index);
            String elementPath = path + "[" + index + "]";
            String resolved = findNullLeafPath(element, segments, segmentIndex + 1, elementPath, depth + 1,
                counter, visited);
            if (resolved != null) {
                return resolved;
            }
        }
        return null;
    }

    private static String findNullLeafInCollection(Collection<?> collection, List<PathSegment> segments,
                                                   int segmentIndex, String path, int depth, MatchCounter counter,
                                                   IdentityHashMap<Object, Boolean> visited) {
        int index = 0;
        for (Object element : collection) {
            String elementPath = path + "[" + index + "]";
            String resolved = findNullLeafPath(element, segments, segmentIndex + 1, elementPath, depth + 1,
                counter, visited);
            if (resolved != null) {
                return resolved;
            }
            index++;
        }
        return null;
    }

    private static String matchNullLeafProperty(Object bean, String propertyName, String path, MatchCounter counter) {
        if (shouldSkipTraversing(bean.getClass())) {
            return null;
        }
        Object value = readProperty(bean, propertyName);
        if (value != null) {
            return null;
        }
        String fullPath = appendProperty(path, propertyName);
        if (counter.acceptMatch()) {
            return fullPath;
        }
        return null;
    }

    private static boolean isNotNullViolation(FieldError fieldError) {
        if (NOT_NULL_CODE.equals(fieldError.getCode())) {
            return true;
        }
        String[] codes = fieldError.getCodes();
        if (codes == null) {
            return false;
        }
        for (String code : codes) {
            if (code != null && code.contains(NOT_NULL_CODE)) {
                return true;
            }
        }
        return false;
    }

    static List<PathSegment> parsePath(String field) {
        List<PathSegment> segments = new ArrayList<>();
        int position = 0;
        while (position < field.length()) {
            if (field.startsWith("[].", position)) {
                segments.add(IndexedCollection.INSTANCE);
                position += 3;
                continue;
            }
            if (field.startsWith("[]", position)) {
                segments.add(IndexedCollection.INSTANCE);
                position += 2;
                continue;
            }

            int dotIndex = field.indexOf('.', position);
            int bracketIndex = field.indexOf('[', position);
            int endIndex;
            if (dotIndex < 0 && bracketIndex < 0) {
                endIndex = field.length();
            } else if (dotIndex < 0) {
                endIndex = bracketIndex;
            } else if (bracketIndex < 0) {
                endIndex = dotIndex;
            } else {
                endIndex = Math.min(dotIndex, bracketIndex);
            }

            segments.add(new Property(field.substring(position, endIndex)));
            position = endIndex;
            if (position < field.length() && field.charAt(position) == '.') {
                position++;
            }
        }
        return segments;
    }

    private static Object readProperty(Object bean, String propertyName) {
        if (bean == null || shouldSkipTraversing(bean.getClass())) {
            return null;
        }
        try {
            BeanInfo beanInfo = Introspector.getBeanInfo(bean.getClass(), Object.class);
            for (PropertyDescriptor descriptor : beanInfo.getPropertyDescriptors()) {
                if (propertyName.equals(descriptor.getName())) {
                    Method readMethod = descriptor.getReadMethod();
                    if (readMethod != null) {
                        return readMethod.invoke(bean);
                    }
                    return null;
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

    sealed interface PathSegment permits Property, IndexedCollection {
    }

    record Property(String name) implements PathSegment {
    }

    record IndexedCollection() implements PathSegment {
        static final IndexedCollection INSTANCE = new IndexedCollection();
    }

    private static final class MatchCounter {
        private final int targetIndex;
        private int matchesSeen;

        MatchCounter(int targetIndex) {
            this.targetIndex = targetIndex;
        }

        boolean acceptMatch() {
            if (matchesSeen == targetIndex) {
                matchesSeen++;
                return true;
            }
            matchesSeen++;
            return false;
        }
    }
}
