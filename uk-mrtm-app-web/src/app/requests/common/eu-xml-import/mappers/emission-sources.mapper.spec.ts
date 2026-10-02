import { mapEmissionSources } from '@requests/common/eu-xml-import/mappers/emission-sources.mapper';

describe('mapEmissionSources', () => {
  it('maps the B5 list completion procedure, defaults emissionCompliance to not exist and leaves emissionFactors unanswered', () => {
    const { emissionSources } = mapEmissionSources({
      emissionSources: { procedureAnnexITableB5: { referenceExistingProcedure: 'REF-B5', procedures: 'Completion' } },
    });

    expect(emissionSources.listCompletion.reference).toBe('REF-B5');
    expect(emissionSources.emissionFactors).toEqual({ exist: undefined });
    expect(emissionSources.emissionCompliance).toBeUndefined();
  });

  it('ignores a B8 procedure entry and leaves the emissionFactors guard question unanswered', () => {
    const { emissionSources } = mapEmissionSources({
      fuelTypes: { procedureAnnexITableB8: { referenceExistingProcedure: 'REF-B8', procedures: 'Factors' } },
    });

    expect(emissionSources.emissionFactors.exist).toBeUndefined();
    expect(emissionSources.emissionFactors.factors).toBeUndefined();
  });

  it('ignores a B9 procedure entry and leaves the emissionFactors guard question unanswered', () => {
    const { emissionSources } = mapEmissionSources({
      fuelTypes: { procedureAnnexIITableB9: { referenceExistingProcedure: 'REF-B9', procedures: 'Biofuels' } },
    });

    expect(emissionSources.emissionFactors.exist).toBeUndefined();
    expect(emissionSources.emissionFactors.factors).toBeUndefined();
  });
});
