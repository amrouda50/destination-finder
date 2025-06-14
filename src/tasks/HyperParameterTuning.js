// HyperparameterTuning.js
import { AlgorithmComparison } from './AlgorithmComparison';
import useTravelRecommenderStore from '../store/travelRecommenderStore';
import testScenariosMultiComposite from '../data/testScenariosMultiComposite.json';

export class HyperparameterTuning {
    constructor(greedyAlgo, geneticAlgo, dynamicAlgo, config = {}) {
        // Configuration with defaults
        this.config = {
            batchSize: config.batchSize || 100,
            maxCacheSize: config.maxCacheSize || 1000,
            timeoutBetweenBatches: config.timeoutBetweenBatches || 0,
            enableProgressTracking: config.enableProgressTracking || true,
            enableCaching: config.enableCaching || true,
            ...config
        };

        this.algorithmComparison = new AlgorithmComparison(greedyAlgo, geneticAlgo, dynamicAlgo);
        this.algorithms = {
            "Greedy": greedyAlgo,
            "Genetic": geneticAlgo,
            "Dynamic": dynamicAlgo
        };

        // Progress tracking
        this.progress = {
            current: 0,
            total: 0,
            algorithm: '',
            stage: ''
        };

        // Result caching
        this.cache = new Map();

        this.parameterSpaces = {
            Genetic: {
                // Core genetic parameters
                populationSize: [20, 30, 50, 70],
                generations: [100, 200, 300],
                mutationRate: [0.01, 0.02, 0.05],
                tournamentSize: [2, 3, 4],

                // Genetic-specific distance decay
                distanceDecay: {
                    strategy: ["exponential", "linear", "quadratic"],
                    scalingFunction: ["linear", "quadratic"],
                    penalties: {
                        genetic: {
                            minPenaltyRate: [0.00001, 0.00002, 0.00004],
                            maxPenaltyRate: [0.00002, 0.00004, 0.00006]
                        }
                    }
                },

                // Week allocation parameters
                weekAllocation: {
                    maxWeeksPerRegionRatio: [0.3, 0.5, 0.7],
                    lambdaPenalty: {
                        scaling: [0.05, 0.1, 0.2]
                    },
                    penaltyFunction: ["quadratic", "linear", "exponential"]
                }
            },

            Dynamic: {
                // Core dynamic parameters
                dominance: {
                    alpha: [0.3, 0.5, 0.7],
                    attributes: [['budgetScore', 'totalAttrScore', 'travelMonthScore',
                        'visitorScore', 'penalizedScore']]
                },

                // Dynamic-specific distance decay
                distanceDecay: {
                    strategy: ["exponential", "linear", "quadratic"],
                    scalingFunction: ["linear", "quadratic"],
                    penalties: {
                        dynamic: {
                            minPenaltyRate: [0, 0.00001, 0.00002],
                            maxPenaltyRate: [0.00004, 0.000055, 0.00007]
                        }
                    }
                },

                // Week allocation parameters
                weekAllocation: {
                    maxWeeksPerRegionRatio: [0.3, 0.5, 0.7],
                    lambdaPenalty: {
                        scaling: [0.05, 0.1, 0.2]
                    },
                    penaltyFunction: ["quadratic", "linear", "exponential"]
                }
            },

            Greedy: {
                // Greedy-specific distance decay
                distanceDecay: {
                    strategy: ["exponential", "linear", "quadratic"],
                    scalingFunction: ["linear", "quadratic"],
                    penalties: {
                        greedy: {
                            minPenaltyRate: [0.00001, 0.00005, 0.0001],
                            maxPenaltyRate: [0.005, 0.01, 0.015]
                        }
                    }
                },

                // Week allocation parameters
                weekAllocation: {
                    maxWeeksPerRegionRatio: [0.3, 0.5, 0.7],
                    lambdaPenalty: {
                        scaling: [0.05, 0.1, 0.2]
                    },
                    penaltyFunction: ["quadratic", "linear", "exponential"]
                }
            }
        };
    }

    getProgress() {
        return { ...this.progress };
    }

    validateParameters(params, algorithmType) {
        try {
            if (!params || typeof params !== 'object') return false;

            switch (algorithmType) {
                case 'Genetic':
                    if (!this.validateGeneticParameters(params)) return false;
                    break;
                case 'Dynamic':
                    if (!this.validateDynamicParameters(params)) return false;
                    break;
                case 'Greedy':
                    if (!this.validateGreedyParameters(params)) return false;
                    break;
            }

            if (params.distanceDecay && !this.validateDistanceDecayParameters(params.distanceDecay)) return false;
            if (params.weekAllocation && !this.validateWeekAllocationParameters(params.weekAllocation)) return false;

            return true;
        } catch (error) {
            return false;
        }
    }

    validateGeneticParameters(params) {
        if (params.populationSize && (params.populationSize < 20 || params.populationSize > 70)) return false;
        if (params.generations && (params.generations < 100 || params.generations > 300)) return false;
        if (params.mutationRate && (params.mutationRate < 0.01 || params.mutationRate > 0.05)) return false;
        if (params.tournamentSize && (params.tournamentSize < 2 || params.tournamentSize > 4)) return false;
        return true;
    }

    validateDynamicParameters(params) {
        if (params.dominance?.alpha && (params.dominance.alpha < 0.3 || params.dominance.alpha > 0.7)) return false;
        return true;
    }

    validateGreedyParameters(params) {
        return true;
    }

    validateDistanceDecayParameters(params) {
        if (!['exponential', 'linear', 'quadratic'].includes(params.strategy)) return false;
        return true;
    }

    validateWeekAllocationParameters(params) {
        if (params.maxWeeksPerRegionRatio && (params.maxWeeksPerRegionRatio < 0.3 || params.maxWeeksPerRegionRatio > 0.7)) return false;
        return true;
    }

    cleanupBatch(results) {
        if (results.length > this.config.maxCacheSize) {
            results.sort((a, b) => b.score - a.score);
            results.length = this.config.maxCacheSize;
        }
    }

    async generateParameterCombinations(algorithmType, numSamples = 1000) {
        const space = this.parameterSpaces[algorithmType];

        function getRandomValue(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function generateRandomCombination(paramSpace) {
            const result = {};

            for (const [key, value] of Object.entries(paramSpace)) {
                if (Array.isArray(value)) {
                    result[key] = getRandomValue(value);
                } else if (typeof value === 'object') {
                    result[key] = generateRandomCombination(value);
                }
            }

            return result;
        }

        const combinations = [];
        for (let i = 0; i < numSamples; i++) {
            combinations.push(generateRandomCombination(space));
        }

        return combinations;
    }

    evaluateParameters(mapCountries, algorithmType, params) {
        try {
            if (!this.validateParameters(params, algorithmType)) {
                return 0;
            }

            const cacheKey = JSON.stringify({ algorithmType, params });
            if (this.config.enableCaching && this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const testParams = this.transformParametersToStoreStructure(params, algorithmType);
            let totalScore = 0;
            let validScenarios = 0;

            testScenariosMultiComposite.scenarios.forEach(scenario => {
                try {
                    let results = [];
                    const startTime = performance.now();
                    // console.log(results)
                    // console.log(algorithmType)
                    this.algorithms[algorithmType](
                        mapCountries,
                        scenario,
                        (res) => { results = res; },
                        testParams
                    );
                    // console.log(results)
                    const endTime = performance.now();
                    const metrics = this.algorithmComparison.calculateMetrics(results, algorithmType);
                    metrics.computationTime = endTime - startTime;

                    const score = this.calculateCompositeScore(metrics, scenario);
                    if (!isNaN(score)) {
                        totalScore += score;
                        validScenarios++;
                    }
                } catch (error) {
                    // Silent fail for individual scenarios
                }
            });

            const finalScore = validScenarios > 0 ? totalScore / validScenarios : 0;

            if (this.config.enableCaching) {
                this.cache.set(cacheKey, finalScore);
                if (this.cache.size > this.config.maxCacheSize) {
                    const firstKey = this.cache.keys().next().value;
                    this.cache.delete(firstKey);
                }
            }

            return finalScore;
        } catch (error) {
            return 0;
        }
    }

    transformParametersToStoreStructure(params, algorithmType) {
        // Get base structure from store
        const baseParams = useTravelRecommenderStore.getState().algorithmParameters;

        // Create new structure
        const transformed = {
            [algorithmType.toLowerCase()]: {
                ...baseParams[algorithmType.toLowerCase()],
                ...params
            }
        };

        return transformed;
    }

    calculateCompositeScore(metrics, scenario) {
        if (!metrics) return 0;

        const safeDiv = (a, b) => (b && b !== 0) ? a / b : 0;

        // Simple distance penalty based on user preference
        const distancePenalty = scenario.isDistanceNotImportant ? 1 :
            Math.max(0, 1 - (scenario.Distance / 100) * (metrics.totalDistance / 10000));

        // Calculate expected cost per week based on budget tier
        const expectedCostPerWeek =
            scenario.Budget === 0 ? 225 :
                scenario.Budget === 50 ? 450 :
                    900;  // for Budget === 100

        // Calculate actual cost per week
        const actualCostPerWeek = metrics.averageTripCost / metrics.averageWeeksPerRegion;

        // Calculate budget score (how well it matches the expected cost per week)
        const budgetScore = actualCostPerWeek <= expectedCostPerWeek ? 1 :
            Math.max(0, 1 - (actualCostPerWeek - expectedCostPerWeek) / expectedCostPerWeek);


        // Week distribution scoring - similar to distance penalty
        const weekDistributionScore = Math.max(0, 1 - (scenario.weekAllocationDistribution / 100) * metrics.averageWeeksPerRegion);
        return (
            (metrics.averageRegionScore || 0) * 0.2 +      // Reduced from 0.25
            distancePenalty * 0.3 +                        // Increased from 0.2
            (metrics.geographicalDiversity || 0) * 0.15 +  // Kept same
            safeDiv(1, metrics.computationTime || 1) * 0.1 + // Kept same
            budgetScore * 0.15 +                          // Kept same
            weekDistributionScore * 0.1                    // Reduced from 0.15
        );
    }

    async findBestParameters(mapCountries) {
        const results = {
            Genetic: [],
            Dynamic: [],
            Greedy: []
        };
        // debugger
        const seenResults = new Map(); // Track unique results

        for (const algorithmType of Object.keys(results)) {
            if (this.config.enableProgressTracking) {
                this.progress.algorithm = algorithmType;
                this.progress.stage = 'Generating combinations';
            }

            const combinations = await this.generateParameterCombinations(algorithmType);
            console.log(`Generated ${combinations.length} combinations for ${algorithmType}`);

            if (this.config.enableProgressTracking) {
                this.progress.total = combinations.length;
                this.progress.stage = 'Evaluating parameters';
            }

            for (let i = 0; i < combinations.length; i += this.config.batchSize) {
                const batch = combinations.slice(i, i + this.config.batchSize);

                const batchResults = await Promise.all(
                    batch.map(async params => {
                        const paramsKey = JSON.stringify(params);
                        if (seenResults.has(paramsKey)) {
                            return seenResults.get(paramsKey);
                        }

                        const score = await this.evaluateParameters(mapCountries, algorithmType, params);
                        seenResults.set(paramsKey, score);
                        return score;
                    })
                );

                batchResults.forEach((score, index) => {
                    if (score > 0) { // Only add non-zero scores
                        results[algorithmType].push({
                            parameters: batch[index],
                            score
                        });
                    }
                });

                if (this.config.enableProgressTracking) {
                    this.progress.current = i + this.config.batchSize;
                }

                this.cleanupBatch(results[algorithmType]);

                console.log(`${algorithmType}: ${Math.min(100, Math.round((i + this.config.batchSize) / combinations.length * 100))}% complete`);

                if (i + this.config.batchSize < combinations.length) {
                    await new Promise(resolve =>
                        setTimeout(resolve, this.config.timeoutBetweenBatches)
                    );
                }
            }


            // Sort and remove duplicates
            results[algorithmType] = Array.from(
                new Map(
                    results[algorithmType]
                        .map(item => [JSON.stringify(item.parameters), item])
                ).values()
            ).sort((a, b) => b.score - a.score);
        }

        return {
            bestParameters: {
                Genetic: this.transformParametersToStoreStructure(
                    results.Genetic[0]?.parameters || {},
                    'Genetic'
                ),
                Dynamic: this.transformParametersToStoreStructure(
                    results.Dynamic[0]?.parameters || {},
                    'Dynamic'
                ),
                Greedy: this.transformParametersToStoreStructure(
                    results.Greedy[0]?.parameters || {},
                    'Greedy'
                )
            },
            allResults: results
        };
    }

    generateTuningReport(results) {
        return {
            bestParameters: results.bestParameters,
            parameterSensitivity: this.analyzeParameterSensitivity(results.allResults),
            statisticalSummary: this.generateStatisticalSummary(results.allResults)
        };
    }

    analyzeParameterSensitivity(results) {
        const sensitivity = {};

        for (const algorithmType of Object.keys(results)) {
            sensitivity[algorithmType] = {};

            const params = Object.keys(this.parameterSpaces[algorithmType] || {});

            params.forEach(param => {
                const values = results[algorithmType].map(r => ({
                    value: r.parameters[param],
                    score: r.score
                }));

                sensitivity[algorithmType][param] = {
                    variance: this.calculateVariance(values.map(v => v.score)),
                    range: {
                        min: Math.min(...values.map(v => v.score)),
                        max: Math.max(...values.map(v => v.score))
                    }
                };
            });
        }

        return sensitivity;
    }

    calculateVariance(values) {
        if (!values || values.length === 0) return 0;
        const mean = values.reduce((a, b) => a + b) / values.length;
        return values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    }

    generateStatisticalSummary(results) {
        const summary = {};

        for (const algorithmType of Object.keys(results)) {
            const scores = results[algorithmType].map(r => r.score);

            summary[algorithmType] = {
                mean: scores.reduce((a, b) => a + b) / scores.length,
                std: Math.sqrt(this.calculateVariance(scores)),
                min: Math.min(...scores),
                max: Math.max(...scores),
                median: scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
            };
        }

        return summary;
    }
}