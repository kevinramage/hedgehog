export interface IBaseScoreMetrics {
    AttackVector: {
        value: AttackVectorValue,
        comments: string
    },
    AttackComplexity: {
        value: AttackComplexityValue;
        comments: string;
    },
    PrivilegesRequired: {
        value: PrivilegesRequiredValue;
        comments: string;
    },
    UserInteraction: {
        value: UserInteractionValue;
        comments: string;
    },
    Scope: {
        value: ScopeValue;
        comments: string;
    },
    ConfidentialityImpact: {
        value: ImpactValue;
        comments: string;
    },
    IntegrityImpact: {
        value: ImpactValue;
        comments: string;
    },
    AvailabilityImpact: {
        value: ImpactValue;
        comments: string;
    }
}

export type AttackVectorValue = "Network" | "Adjacent Network" | "Local" | "Physical";
export type AttackComplexityValue = "Low" | "High";
export type PrivilegesRequiredValue = "None" | "Low" | "High";
export type UserInteractionValue = "None" | "Required";
export type ScopeValue = "Unchanged" | "Changed";
export type ImpactValue = "None" | "Low" | "High";