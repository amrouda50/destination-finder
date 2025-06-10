import { create } from 'zustand'

const useTravelRecommenderStore = create((set) => ({
    countries: [],
    userData: {
        isPriceImportant: false,
        Budget: 50,
        Distance: 50,
        isDistanceNotImportant: false,
        weekAllocationDistribution: 50,
        Weeks: 50,
        Months: Array(12).fill(0),
        PresetType: [],
        isPeakSeasonImportant: false,
        /**
         * Decide whether to use visited
         * index for scoring regions
         */
        isVisitorIndexImportant: true,
        /**
         * Scaled between 0-100 targeted percentage
         * of people visiting the country, acts in a
         * similar way to the `userData.Budget`
         * @type {{ weight: number, score: number }}
         */
        VisitorIndex: {
            // importance of the visitorIndex in the overall algorithm calculation
            weight: 1,
            // how much crowded the place should be according to the user
            score: 50,
        },
        Attributes: {
            Nature: {
                weight: 1,
                score: 50,
            },
            Architecture: {
                weight: 1,
                score: 50,
            },
            Hiking: {
                weight: 1,
                score: 50,
            },
            Wintersports: {
                weight: 1,
                score: 50,
            },
            Beach: {
                weight: 1,
                score: 50,
            },
            Culture: {
                weight: 1,
                score: 50,
            },
            Culinary: {
                weight: 1,
                score: 50,
            },
            Entertainment: {
                weight: 1,
                score: 50,
            },
            Shopping: {
                weight: 1,
                score: 50,
            },
        },
    },

    // Algorithm Parameters moved to root level
    // algorithmParameters: {
    //     // Algorithm-specific parameters
    //     genetic: {
    //         populationSize: 20,
    //         generations: 200,
    //         mutationRate: 0.01,
    //         tournamentSize: 4,
    //         description: {
    //             populationSize: "Number of chromosomes in each generation",
    //             generations: "Number of evolution iterations",
    //             mutationRate: "Probability of mutation occurring",
    //             tournamentSize: "Number of candidates in tournament selection"
    //         },
    //         distanceDecay: {
    //             strategy: "exponential",
    //             scalingFunction: "linear",
    //             penalties: {
    //                 genetic: {
    //                     minPenaltyRate: 0.00001,
    //                     maxPenaltyRate: 0.00004,
    //                     description: "Lower penalties due to multiplicative accumulation in genetic algorithm"
    //                 }
    //             },
    //             description: {
    //                 strategy: "Method used to decay distance penalties (exponential/linear/quadratic)",
    //                 scalingFunction: "How user distance preference is scaled",
    //                 penalties: "Algorithm-specific penalty ranges for distance calculations"
    //             }
    //         },
    //         weekAllocation: {
    //             maxWeeksPerRegionRatio: 0.5,
    //             lambdaPenalty: {
    //                 percentage: true,
    //                 range: {
    //                     min: 0,
    //                     max: 100
    //                 },
    //                 scaling: 0.1,
    //                 description: "Percentage-based penalty (0-100%) scaled by 0.1 to control distribution uniformity"
    //             },
    //             penaltyFunction: "quadratic",
    //             description: {
    //                 maxWeeksPerRegionRatio: "Maximum weeks per region as ratio of total weeks",
    //                 lambdaPenalty: "Penalty weight for deviation from mean distribution",
    //                 penaltyFunction: "Type of penalty function for deviation from mean"
    //             }
    //         },
    //     },

    //     greedy: {
    //         distanceDecay: {
    //             strategy: "exponential",
    //             scalingFunction: "linear",
    //             penalties: {
    //                 greedy: {
    //                     minPenaltyRate: 0.00001,
    //                     maxPenaltyRate: 0.01,
    //                     description: "Higher penalties as they're applied individually in greedy algorithm"
    //                 }
    //             },
    //             description: {
    //                 strategy: "Method used to decay distance penalties (exponential/linear/quadratic)",
    //                 scalingFunction: "How user distance preference is scaled",
    //                 penalties: "Algorithm-specific penalty ranges for distance calculations"
    //             }
    //         },
    //         weekAllocation: {
    //             maxWeeksPerRegionRatio: 0.5,
    //             lambdaPenalty: {
    //                 percentage: true,
    //                 range: {
    //                     min: 0,
    //                     max: 100
    //                 },
    //                 scaling: 0.1,
    //                 description: "Percentage-based penalty (0-100%) scaled by 0.1 to control distribution uniformity"
    //             },
    //             penaltyFunction: "quadratic",
    //             description: {
    //                 maxWeeksPerRegionRatio: "Maximum weeks per region as ratio of total weeks",
    //                 lambdaPenalty: "Penalty weight for deviation from mean distribution",
    //                 penaltyFunction: "Type of penalty function for deviation from mean"
    //             }
    //         },
    //     },

    //     dynamic: {
    //         dominance: {
    //             alpha: 0.5,
    //             attributes: ['budgetScore', 'totalAttrScore', 'travelMonthScore',
    //                 'visitorScore', 'penalizedScore'],
    //             normalization: "maxNorm",
    //             description: {
    //                 alpha: "Weight between Excellence Count and Dominance Degree",
    //                 attributes: "Attributes used for dominance comparison",
    //                 normalization: "Method used to normalize scores"
    //             }
    //         },
    //         distanceDecay: {
    //             strategy: "exponential",
    //             scalingFunction: "linear",
    //             penalties: {
    //                 dynamic: {
    //                     minPenaltyRate: 0,
    //                     maxPenaltyRate: 0.000055,
    //                     description: "Moderate penalties for balanced approach in dynamic algorithm"
    //                 }
    //             },
    //             description: {
    //                 strategy: "Method used to decay distance penalties (exponential/linear/quadratic)",
    //                 scalingFunction: "How user distance preference is scaled",
    //                 penalties: "Algorithm-specific penalty ranges for distance calculations"
    //             }
    //         },
    //         weekAllocation: {
    //             maxWeeksPerRegionRatio: 0.5,
    //             lambdaPenalty: {
    //                 percentage: true,
    //                 range: {
    //                     min: 0,
    //                     max: 100
    //                 },
    //                 scaling: 0.1,
    //                 description: "Percentage-based penalty (0-100%) scaled by 0.1 to control distribution uniformity"
    //             },
    //             penaltyFunction: "quadratic",
    //             description: {
    //                 maxWeeksPerRegionRatio: "Maximum weeks per region as ratio of total weeks",
    //                 lambdaPenalty: "Penalty weight for deviation from mean distribution",
    //                 penaltyFunction: "Type of penalty function for deviation from mean"
    //             }
    //         },
    
    //     }
    // },

    algorithmParameters: {
        // Algorithm-specific parameters
        genetic: {
            populationSize: 20,
            generations: 100,
            mutationRate: 0.01,
            tournamentSize: 4,
            description: {
                populationSize: "Number of chromosomes in each generation",
                generations: "Number of evolution iterations",
                mutationRate: "Probability of mutation occurring",
                tournamentSize: "Number of candidates in tournament selection"
            },
            distanceDecay: {
                strategy: "exponential",
                scalingFunction: "linear",
                penalties: {
                    genetic: {
                        minPenaltyRate: 0.00004,
                        maxPenaltyRate: 0.00006,
                        description: "Lower penalties due to multiplicative accumulation in genetic algorithm"
                    }
                },
                description: {
                    strategy: "Method used to decay distance penalties (exponential/linear/quadratic)",
                    scalingFunction: "How user distance preference is scaled",
                    penalties: "Algorithm-specific penalty ranges for distance calculations"
                }
            },
            weekAllocation: {
                maxWeeksPerRegionRatio: 0.3,
                lambdaPenalty: {
                    percentage: true,
                    range: {
                        min: 0,
                        max: 100
                    },
                    scaling: 0.2,
                    description: "Percentage-based penalty (0-100%) scaled by 0.1 to control distribution uniformity"
                },
                penaltyFunction: "exponential",
                description: {
                    maxWeeksPerRegionRatio: "Maximum weeks per region as ratio of total weeks",
                    lambdaPenalty: "Penalty weight for deviation from mean distribution",
                    penaltyFunction: "Type of penalty function for deviation from mean"
                }
            },
        },

        greedy: {
            distanceDecay: {
                strategy: "linear",
                scalingFunction: "linear",
                penalties: {
                    greedy: {
                        minPenaltyRate: 0.0001,
                        maxPenaltyRate:  0.015,
                        description: "Higher penalties as they're applied individually in greedy algorithm"
                    }
                },
                description: {
                    strategy: "Method used to decay distance penalties (exponential/linear/quadratic)",
                    scalingFunction: "How user distance preference is scaled",
                    penalties: "Algorithm-specific penalty ranges for distance calculations"
                }
            },
            weekAllocation: {
                maxWeeksPerRegionRatio: 0.3,
                lambdaPenalty: {
                    percentage: true,
                    range: {
                        min: 0,
                        max: 100
                    },
                    scaling: 0.2,
                    description: "Percentage-based penalty (0-100%) scaled by 0.1 to control distribution uniformity"
                },
                penaltyFunction: "exponential",
                description: {
                    maxWeeksPerRegionRatio: "Maximum weeks per region as ratio of total weeks",
                    lambdaPenalty: "Penalty weight for deviation from mean distribution",
                    penaltyFunction: "Type of penalty function for deviation from mean"
                }
            },
        },

        dynamic: {
            dominance: {
                alpha: 0.5,
                attributes: ['budgetScore', 'totalAttrScore', 'travelMonthScore',
                    'visitorScore', 'penalizedScore'],
                normalization: "maxNorm",
                description: {
                    alpha: "Weight between Excellence Count and Dominance Degree",
                    attributes: "Attributes used for dominance comparison",
                    normalization: "Method used to normalize scores"
                }
            },
            distanceDecay: {
                strategy: "linear",
                scalingFunction: "linear",
                penalties: {
                    dynamic: {
                        minPenaltyRate: 0.00002,
                        maxPenaltyRate: 0.00007,
                        description: "Moderate penalties for balanced approach in dynamic algorithm"
                    }
                },
                description: {
                    strategy: "Method used to decay distance penalties (exponential/linear/quadratic)",
                    scalingFunction: "How user distance preference is scaled",
                    penalties: "Algorithm-specific penalty ranges for distance calculations"
                }
            },
            weekAllocation: {
                maxWeeksPerRegionRatio: 0.7,
                lambdaPenalty: {
                    percentage: true,
                    range: {
                        min: 0,
                        max: 100
                    },
                    scaling: 0.2,
                    description: "Percentage-based penalty (0-100%) scaled by 0.1 to control distribution uniformity"
                },
                penaltyFunction: "exponential",
                description: {
                    maxWeeksPerRegionRatio: "Maximum weeks per region as ratio of total weeks",
                    lambdaPenalty: "Penalty weight for deviation from mean distribution",
                    penaltyFunction: "Type of penalty function for deviation from mean"
                }
            },
    
        }
    },

    results: [],
    recommendationType: 'single',
    algorithmUsed: "greedy",
    refresh: true,

    // Actions
    setRefresh: () => set(state => ({ refresh: !state.refresh })),
    setAlgorithmUsed: (algorithm) => set({ algorithmUsed: algorithm }),
    setRecommendationType: (type) => set({ recommendationType: type }),
    setCountries: (newCountries) => set({ countries: newCountries }),
    setUserData: (newUserData) => set({ userData: newUserData }),
    setResults: (newResults) => set({ results: newResults }),

    // Algorithm parameter actions
    setAlgorithmParameter: (algorithmType, paramName, value) =>
        set(state => ({
            algorithmParameters: {
                ...state.algorithmParameters,
                [algorithmType]: {
                    ...state.algorithmParameters[algorithmType],
                    [paramName]: value
                }
            }
        })),

    setWeekAllocationParameter: (paramName, value) =>
        set(state => ({
            algorithmParameters: {
                ...state.algorithmParameters,
                weekAllocation: {
                    ...state.algorithmParameters.weekAllocation,
                    [paramName]: value
                }
            }
        })),

    setDistanceDecayParameter: (paramName, value) =>
        set(state => ({
            algorithmParameters: {
                ...state.algorithmParameters,
                distanceDecay: {
                    ...state.algorithmParameters.distanceDecay,
                    [paramName]: value
                }
            }
        })),

    // Reset parameters to defaults
    resetAlgorithmParameters: () =>
        set(state => ({
            algorithmParameters: {
                ...state.algorithmParameters,
                weekAllocation: {
                    minWeeksPerRegion: 1,
                    maxWeeksPerRegionRatio: 0.5,
                    lambdaPenalty: {
                        percentage: true,
                        range: { min: 0, max: 100 },
                        scaling: 0.1,
                        description: state.algorithmParameters.weekAllocation.lambdaPenalty.description
                    },
                    penaltyFunction: "quadratic",
                    description: state.algorithmParameters.weekAllocation.description
                },
                distanceDecay: {
                    strategy: "exponential",
                    minPenaltyRate: 0.00001,
                    maxPenaltyRate: 0.01,
                    scalingFunction: "linear",
                    description: state.algorithmParameters.distanceDecay.description
                }
            }
        }))
}));

export default useTravelRecommenderStore;