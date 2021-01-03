import { IBaseScoreMetrics, ImpactValue } from "../business/test/baseScoreMetrics";

export class CVSSBaseScoreMetricsUtils {
    private _baseScoreMetrics : IBaseScoreMetrics;

    constructor(baseScoreMetrics: IBaseScoreMetrics) {
        this._baseScoreMetrics = baseScoreMetrics;
    }

    public roundUp(input: number) {
        const intInput = Math.round(input * 100000)
        if ((intInput % 10000) === 0) {
            return intInput / 100000.0;
        } else {
            return (Math.floor(intInput / 10000) + 1) / 10.0;
        }
    }

    public get baseScore() {
        const impact = this.impactScore;
        if (impact > 0) {
            if (this.isScopeChanged) {
                return this.roundUp(Math.min(1.08 * (this.impactScore + this.exploitationScore), 10));
            } else {
                return this.roundUp(Math.min((this.impactScore + this.exploitationScore), 10));
            }
        } else {
            return 0;
        }
    }

    public get exploitationScore() {
        return 8.22 * this.attackVectorMetric * this.attackComplexityMetric * this.privilegesRequiredMetric * this.userInteractionMetric;
    }

    public get impactScore() {
        if (this.isScopeChanged) {
            return 7.52 * (this.impactSubScore - 0.029) - 3.25 * Math.pow(this.impactSubScore - 0.02, 15);
        } else {
            return 6.42 * this.impactSubScore;
        }
    }

    public get impactSubScore() {
        return 	1 - ((1 - this.confidentialityMetric) * (1 - this.integrityMetric) * (1 - this.availabilityMetric));
    }

    public get attackVectorMetric() {
        switch (this._baseScoreMetrics.AttackVector.value) {
            case "Network": return 0.85;
            case "Adjacent Network": return 0.62;
            case "Local": return 0.55;
            case "Physical": return 0.2;
            default: throw new Error("invalid value");
        }
    }

    public get attackComplexityMetric() {
        switch (this._baseScoreMetrics.AttackComplexity.value) {
            case "Low": return 0.77;
            case "High": return 0.44;
            default: throw new Error("invalid value");
        }
    }

    public get privilegesRequiredMetric() {
        switch (this._baseScoreMetrics.PrivilegesRequired.value) {
            case "None": return 0.85;
            case "Low": return this.isScopeChanged ? 0.68 : 0.62;
            case "High": return this.isScopeChanged ? 0.5 : 0.27;
            default: throw new Error("invalid value");
        }
    }

    public get userInteractionMetric() {
        switch (this._baseScoreMetrics.UserInteraction.value) {
            case "None": return 0.85;
            case "Required": return 0.62;
            default: throw new Error("invalid value");
        }
    }

    public get confidentialityMetric() {
        return this.getImpactMetric(this._baseScoreMetrics.ConfidentialityImpact.value);
    }

    public get integrityMetric() {
        return this.getImpactMetric(this._baseScoreMetrics.IntegrityImpact.value);
    }

    public get availabilityMetric() {
        return this.getImpactMetric(this._baseScoreMetrics.AvailabilityImpact.value);
    }

    public getImpactMetric(impactMetric: ImpactValue) {
        switch (impactMetric) {
            case "None": return 0;
            case "Low": return 0.22;
            case "High": return 0.56;
            default: throw new Error("invalid value");
        }
    }

    public get isScopeChanged() {
        switch (this._baseScoreMetrics.Scope.value) {
            case "Changed": return true;
            case "Unchanged": return false;
            default: throw new Error("invalid value");
        }
    }

}