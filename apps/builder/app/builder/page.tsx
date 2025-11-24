"use client";

import { useState, useEffect, useRef } from "react";
import { useCreateBuild, useUpdateBuild } from "../hooks/api/useBuild";
import { useListComponents } from "../hooks/api/useComponent";
import { useDebounce } from "../hooks/useDebounce";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cpu,
  HardDrive,
  MemoryStick,
  Boxes,
  MonitorPlay,
  Zap,
  Box,
  Fan,
  Info,
  Loader2,
} from "lucide-react";
import ComponentDetailModal from "./components/component-detail-modal";

// Define build steps with dependencies (reordered for logical flow)
const BUILD_STEPS = [
  {
    key: "cpu",
    label: "Processor (CPU)",
    type: "CPU",
    icon: Cpu,
    required: true,
    dependsOn: [],
    description: "Start with choosing your processor",
  },
  {
    key: "motherboard",
    label: "Motherboard",
    type: "MOTHERBOARD",
    icon: Boxes,
    required: true,
    dependsOn: ["cpu"],
    description: "Must be compatible with CPU socket",
  },
  {
    key: "ram",
    label: "Memory (RAM)",
    type: "RAM",
    icon: MemoryStick,
    required: true,
    dependsOn: ["motherboard"],
    description: "Must match motherboard memory type",
  },
  {
    key: "gpu",
    label: "Graphics Card (GPU)",
    type: "GPU",
    icon: MonitorPlay,
    required: false,
    dependsOn: [],
    description: "Optional for integrated graphics",
  },
  {
    key: "storage",
    label: "Storage",
    type: "STORAGE",
    icon: HardDrive,
    required: true,
    dependsOn: [],
    description: "At least one storage device required",
  },
  {
    key: "psu",
    label: "Power Supply (PSU)",
    type: "PSU",
    icon: Zap,
    required: true,
    dependsOn: [],
    description: "Powers all components",
  },
  {
    key: "cooling",
    label: "Cooling",
    type: "COOLING",
    icon: Fan,
    required: false,
    dependsOn: ["cpu"],
    description: "Must be compatible with CPU socket",
  },
  {
    key: "case",
    label: "Case",
    type: "CASE",
    icon: Box,
    required: true,
    dependsOn: ["motherboard"],
    description: "Must fit motherboard form factor",
  },
] as const;

interface BuildState {
  name: string;
  cpuId?: number;
  motherboardId?: number;
  ramId?: number;
  storageId?: number;
  gpuId?: number;
  psuId?: number;
  caseId?: number;
  coolingId?: number;
}

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [buildState, setBuildState] = useState<BuildState>({
    name: `My Build - ${new Date().toLocaleDateString()}`,
  });
  const [buildId, setBuildId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponentForDetail, setSelectedComponentForDetail] = useState<
    number | null
  >(null);

  // Get current step config first (needed for useListComponents)
  const currentStepConfig = BUILD_STEPS[currentStep]!;
  const StepIcon = currentStepConfig.icon;

  // Debounce search query untuk menghindari terlalu banyak request
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get dependency IDs for current step to include in query key
  // This ensures the query resets when dependencies change
  const getDependencyIds = () => {
    const deps: Record<string, number | undefined> = {};
    currentStepConfig.dependsOn.forEach((depKey) => {
      deps[depKey] = buildState[`${depKey}Id` as keyof BuildState] as
        | number
        | undefined;
    });
    return deps;
  };

  const dependencyIds = getDependencyIds();

  // Debug: Log ketika dependency IDs berubah
  useEffect(() => {
    if (dependencyIds.cpu || dependencyIds.motherboard) {
      console.log(
        `🔍 [${currentStepConfig.label}] Query dengan dependencies:`,
        {
          cpuId: dependencyIds.cpu,
          motherboardId: dependencyIds.motherboard,
          type: currentStepConfig.type,
        },
      );
    }
  }, [
    dependencyIds.cpu,
    dependencyIds.motherboard,
    currentStepConfig.label,
    currentStepConfig.type,
  ]);

  const { components, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useListComponents({
      type: currentStepConfig.type,
      search: debouncedSearch || undefined,
      limit: 20,
      // Include dependency IDs in query params
      // This makes React Query treat it as a new query when deps change
      cpuId: dependencyIds.cpu,
      motherboardId: dependencyIds.motherboard,
    });
  const createBuildMutation = useCreateBuild();
  const updateBuildMutation = useUpdateBuild();

  // Check if step is locked (dependencies not met)
  const isStepLocked = (stepIndex: number): boolean => {
    const step = BUILD_STEPS[stepIndex];
    if (!step || step.dependsOn.length === 0) return false;

    // Check if all dependencies are fulfilled
    return step.dependsOn.some((depKey) => {
      const componentId = buildState[`${depKey}Id` as keyof BuildState];
      return !componentId;
    });
  };

  // Get compatibility info for filtering
  const getCompatibilityFilter = (stepKey: string) => {
    switch (stepKey) {
      case "motherboard": {
        // Filter motherboards by CPU socket
        const cpu = buildState.cpuId
          ? components.find((c) => c.id === buildState.cpuId)
          : null;
        if (!cpu) return null;
        const cpuSpecs = cpu.specifications as Record<string, any>;
        return { socket: cpuSpecs.socket };
      }
      case "ram": {
        // Filter RAM by motherboard memory type
        const motherboard = buildState.motherboardId
          ? components.find((c) => c.id === buildState.motherboardId)
          : null;
        if (!motherboard) return null;
        const mbSpecs = motherboard.specifications as Record<string, any>;
        return { memoryType: mbSpecs.memoryType };
      }
      case "cooling": {
        // Filter cooling by CPU socket
        const cpu = buildState.cpuId
          ? components.find((c) => c.id === buildState.cpuId)
          : null;
        if (!cpu) return null;
        const cpuSpecs = cpu.specifications as Record<string, any>;
        return { socket: cpuSpecs.socket };
      }
      case "case": {
        // Filter cases by motherboard form factor
        const motherboard = buildState.motherboardId
          ? components.find((c) => c.id === buildState.motherboardId)
          : null;
        if (!motherboard) return null;
        const mbSpecs = motherboard.specifications as Record<string, any>;
        return { formFactor: mbSpecs.formFactor };
      }
      default:
        return null;
    }
  };

  // Check component compatibility
  const isComponentCompatible = (component: any, stepKey: string): boolean => {
    const filter = getCompatibilityFilter(stepKey);
    if (!filter) return true; // No filter means all compatible

    const specs = component.specifications as Record<string, any>;

    switch (stepKey) {
      case "motherboard":
        return specs.socket === filter.socket;
      case "ram":
        return (
          specs.type === filter.memoryType ||
          specs.memoryType === filter.memoryType
        );
      case "cooling":
        return (
          specs.socket === filter.socket ||
          specs.compatibility?.includes(filter.socket)
        );
      case "case":
        return (
          specs.formFactor === filter.formFactor ||
          specs.compatibility?.includes(filter.formFactor)
        );
      default:
        return true;
    }
  };

  // Filter components by compatibility (type and search already filtered by backend)
  const filteredComponents = components.filter((c) =>
    isComponentCompatible(c, currentStepConfig.key),
  );

  // Get selected component ID for current step
  const selectedComponentId = buildState[
    `${currentStepConfig.key}Id` as keyof BuildState
  ] as number | undefined;

  // Calculate total price
  const totalPrice = BUILD_STEPS.reduce((sum, step) => {
    const componentId = buildState[`${step.key}Id` as keyof BuildState] as
      | number
      | undefined;
    if (componentId) {
      const component = components.find((c) => c.id === componentId);
      return sum + (component?.price || 0);
    }
    return sum;
  }, 0);

  // Calculate progress
  const completedSteps = BUILD_STEPS.filter(
    (step) => buildState[`${step.key}Id` as keyof BuildState],
  ).length;
  const progress = (completedSteps / BUILD_STEPS.length) * 100;

  const handleSelectComponent = async (componentId: number) => {
    // Clear dependent components when changing a parent component
    const clearDependentComponents = () => {
      const clearedState = { ...buildState };
      const clearedSteps: string[] = [];

      // Find all steps that depend on the current step
      BUILD_STEPS.forEach((step) => {
        if (
          (step.dependsOn as readonly string[]).includes(currentStepConfig.key)
        ) {
          // Check if this component was selected before clearing
          const stepKey = `${step.key}Id` as keyof BuildState;
          if (buildState[stepKey]) {
            clearedSteps.push(step.label);
          }
          // Clear this dependent component
          delete clearedState[stepKey];

          // Also clear components that depend on this one (recursive)
          BUILD_STEPS.forEach((nestedStep) => {
            if (
              (nestedStep.dependsOn as readonly string[]).includes(step.key)
            ) {
              const nestedKey = `${nestedStep.key}Id` as keyof BuildState;
              if (buildState[nestedKey]) {
                clearedSteps.push(nestedStep.label);
              }
              delete clearedState[nestedKey];
            }
          });
        }
      });

      return { clearedState, clearedSteps };
    };

    // Start with cleared dependent components
    const { clearedState: baseState, clearedSteps } =
      clearDependentComponents();

    const updatedBuild = {
      ...baseState,
      [`${currentStepConfig.key}Id`]: componentId,
    };
    setBuildState(updatedBuild);

    // Show notification if components were cleared
    if (clearedSteps.length > 0) {
      console.log(
        `🔄 Cleared incompatible components: ${clearedSteps.join(", ")}`,
      );
    }

    // Auto-save build
    if (buildId) {
      await updateBuildMutation.mutateAsync({
        id: buildId,
        data: updatedBuild,
      });
    } else {
      const newBuild = await createBuildMutation.mutateAsync({
        ...updatedBuild,
        status: "DRAFT",
      });
      setBuildId(newBuild.id);
    }
  };

  const handleNext = () => {
    if (currentStep < BUILD_STEPS.length - 1) {
      // Find next unlocked step
      let nextStep = currentStep + 1;
      while (nextStep < BUILD_STEPS.length && isStepLocked(nextStep)) {
        nextStep++;
      }
      if (nextStep < BUILD_STEPS.length) {
        setCurrentStep(nextStep);
        setSearchQuery("");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSearchQuery("");
    }
  };

  const handleSkipStep = () => {
    // Only allow skip if step is not required
    if (!currentStepConfig.required) {
      handleNext();
    }
  };

  const handleNavigateToStep = (stepIndex: number) => {
    // Don't allow navigation to locked steps
    if (!isStepLocked(stepIndex)) {
      setCurrentStep(stepIndex);
      setSearchQuery("");
    }
  };

  const handleCompleteBuild = async () => {
    // Check if all required components are selected
    const missingRequired = BUILD_STEPS.filter(
      (step) =>
        step.required && !buildState[`${step.key}Id` as keyof BuildState],
    );

    if (missingRequired.length > 0) {
      const missing = missingRequired.map((s) => s.label).join(", ");
      alert(`Please select required components: ${missing}`);
      return;
    }

    if (buildId) {
      await updateBuildMutation.mutateAsync({
        id: buildId,
        data: {
          status: "COMPLETED",
        },
      });
      alert("Build completed successfully! 🎉");
    }
  };

  const handleRemoveComponent = async (componentId: number) => {
    // Find which component type to remove
    const stepToRemove = BUILD_STEPS.find((step) => {
      const id = buildState[`${step.key}Id` as keyof BuildState];
      return id === componentId;
    });

    if (stepToRemove && buildId) {
      const updatedBuild = {
        ...buildState,
        [`${stepToRemove.key}Id`]: undefined,
      };
      setBuildState(updatedBuild);

      await updateBuildMutation.mutateAsync({
        id: buildId,
        data: {
          [`${stepToRemove.key}Id`]: null,
        },
      });
    }
  };

  // Get component details for modal
  const componentForDetail = selectedComponentForDetail
    ? (components.find((c) => c.id === selectedComponentForDetail) ?? null)
    : null;

  const isComponentSelected = selectedComponentForDetail
    ? BUILD_STEPS.some((step) => {
        const id = buildState[`${step.key}Id` as keyof BuildState];
        return id === selectedComponentForDetail;
      })
    : false;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Infinite Scroll Setup
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        root: document.querySelector("#components-scroll-container"),
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            PC Builder
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Build your dream PC step by step with automatic compatibility
            checking
          </p>

          {/* Info Banner */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  🔒 Smart Compatibility System
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Some components are locked until you select compatible parts.
                  For example, you must choose a CPU first before selecting a
                  motherboard with the matching socket. Components marked with{" "}
                  <span className="text-red-500 font-semibold">*</span> are
                  required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Progress: {completedSteps}/{BUILD_STEPS.length} components
              selected
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-4">
            {BUILD_STEPS.map((step, index) => {
              const isCompleted =
                buildState[`${step.key}Id` as keyof BuildState];
              const isCurrent = index === currentStep;
              const Icon = step.icon;

              const isLocked = isStepLocked(index);

              return (
                <button
                  key={step.key}
                  onClick={() => handleNavigateToStep(index)}
                  disabled={isLocked}
                  title={
                    isLocked ? `Locked: ${step.description}` : step.description
                  }
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                    ${
                      isCurrent
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                        : isCompleted
                          ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                          : isLocked
                            ? "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:scale-105"
                    }
                    ${!isLocked && "hover:scale-105"}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {step.label}
                    {step.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                  {isCompleted && <Check className="w-4 h-4" />}
                  {isLocked && (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Component Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <StepIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">
                        Step {currentStep + 1}: {currentStepConfig.label}
                      </CardTitle>
                      {currentStepConfig.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {currentStepConfig.description}
                    </p>
                    {currentStepConfig.dependsOn.length > 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        💡 Filtered based on compatibility with{" "}
                        {currentStepConfig.dependsOn
                          .map(
                            (dep) =>
                              BUILD_STEPS.find((s) => s.key === dep)?.label,
                          )
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-3 max-h-[600px] overflow-y-auto pr-2"
                  id="components-scroll-container"
                >
                  {filteredComponents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <p className="text-lg">No compatible components found</p>
                      <p className="text-sm mt-2">
                        {searchQuery
                          ? "Try a different search term"
                          : currentStepConfig.dependsOn.length > 0
                            ? "No components match your selected parts. Try changing previous selections."
                            : "No components available for this category"}
                      </p>
                    </div>
                  ) : (
                    filteredComponents.map((component) => {
                      const isSelected = selectedComponentId === component.id;
                      const specs = component.specifications as Record<
                        string,
                        string | number | boolean
                      >;

                      // Get relevant compatibility info
                      let compatibilityInfo: string | null = null;
                      if (
                        currentStepConfig.key === "motherboard" &&
                        specs.socket
                      ) {
                        compatibilityInfo = `Socket: ${specs.socket}`;
                      } else if (
                        currentStepConfig.key === "ram" &&
                        (specs.type || specs.memoryType)
                      ) {
                        compatibilityInfo = `Type: ${specs.type || specs.memoryType}`;
                      } else if (
                        currentStepConfig.key === "cooling" &&
                        specs.socket
                      ) {
                        compatibilityInfo = `Socket: ${specs.socket}`;
                      } else if (
                        currentStepConfig.key === "case" &&
                        specs.formFactor
                      ) {
                        compatibilityInfo = `Form Factor: ${specs.formFactor}`;
                      }

                      const keySpecs = Object.entries(specs)
                        .filter(([key]) => {
                          // Don't show compatibility info in specs since we show it separately
                          if (
                            currentStepConfig.key === "motherboard" &&
                            key === "socket"
                          )
                            return false;
                          if (
                            currentStepConfig.key === "ram" &&
                            (key === "type" || key === "memoryType")
                          )
                            return false;
                          if (
                            currentStepConfig.key === "cooling" &&
                            key === "socket"
                          )
                            return false;
                          if (
                            currentStepConfig.key === "case" &&
                            key === "formFactor"
                          )
                            return false;
                          return true;
                        })
                        .slice(0, 3);

                      return (
                        <div
                          key={`${currentStepConfig.type}-${component.id}`}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all relative group
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                            }
                          `}
                        >
                          <div
                            onClick={() => handleSelectComponent(component.id)}
                            className="flex items-start justify-between gap-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                  {component.name}
                                </h3>
                                {isSelected && (
                                  <Badge className="bg-blue-500">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                              {compatibilityInfo && (
                                <div className="mb-2">
                                  <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-xs">
                                    ✓ {compatibilityInfo}
                                  </Badge>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {keySpecs.map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                                  >
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {formatPrice(component.price)}
                              </p>
                            </div>
                            {component.imageUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={component.imageUrl}
                                alt={component.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}
                          </div>

                          {/* View Details Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComponentForDetail(component.id);
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 shadow-lg"
                            title="View detailed specifications"
                          >
                            <Info className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      );
                    })
                  )}

                  {/* Infinite Scroll Trigger */}
                  {hasNextPage && filteredComponents.length > 0 && (
                    <div ref={loadMoreRef} className="flex justify-center py-4">
                      {isFetchingNextPage && (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          <span className="text-sm">
                            Loading more components...
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {!currentStepConfig.required && (
                <Button
                  onClick={handleSkipStep}
                  variant="ghost"
                  className="text-slate-600 dark:text-slate-400"
                >
                  Skip (Optional)
                </Button>
              )}
              {currentStepConfig.required && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  * Required component
                </span>
              )}

              {currentStep < BUILD_STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteBuild}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={completedSteps === 0}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Complete Build
                </Button>
              )}
            </div>
          </div>

          {/* Build Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Build Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Build Name */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Build Name
                    </label>
                    <Input
                      type="text"
                      value={buildState.name}
                      onChange={(e) =>
                        setBuildState({ ...buildState, name: e.target.value })
                      }
                      placeholder="Enter build name"
                    />
                  </div>

                  {/* Selected Components */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Selected Components
                    </h3>
                    <div className="space-y-2">
                      {BUILD_STEPS.map((step) => {
                        const componentId = buildState[
                          `${step.key}Id` as keyof BuildState
                        ] as number | undefined;
                        const component = components.find(
                          (c) => c.id === componentId,
                        );
                        const Icon = step.icon;
                        const isLocked = isStepLocked(
                          BUILD_STEPS.indexOf(step),
                        );

                        return (
                          <div
                            key={step.key}
                            onClick={() =>
                              component &&
                              setSelectedComponentForDetail(component.id)
                            }
                            title={
                              component
                                ? "Click to view details"
                                : isLocked
                                  ? `Locked: ${step.description}`
                                  : step.description
                            }
                            className={`
                              p-3 rounded-lg border transition-all
                              ${
                                component
                                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 cursor-pointer hover:border-green-300 dark:hover:border-green-700 hover:shadow-md hover:scale-[1.02]"
                                  : isLocked
                                    ? "border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800/50 opacity-60"
                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                {step.label}
                                {step.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </span>
                              {component && (
                                <Info className="w-3 h-3 ml-auto text-slate-400" />
                              )}
                              {isLocked && (
                                <svg
                                  className="w-3 h-3 ml-auto text-slate-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            {component ? (
                              <>
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                  {component.name}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                                  {formatPrice(component.price)}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                  {isLocked ? "Locked" : "Not selected"}
                                </p>
                                {isLocked && step.dependsOn.length > 0 && (
                                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                                    Needs:{" "}
                                    {step.dependsOn
                                      .map(
                                        (dep) =>
                                          BUILD_STEPS.find((s) => s.key === dep)
                                            ?.label,
                                      )
                                      .join(", ")}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">
                        Total Price
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p>
                        Components selected: {completedSteps}/
                        {BUILD_STEPS.length}
                      </p>
                      <p className="mt-1">
                        {buildId
                          ? `Build ID: #${buildId}`
                          : "Build not saved yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Component Detail Modal */}
      <ComponentDetailModal
        component={componentForDetail}
        isOpen={selectedComponentForDetail !== null}
        onClose={() => setSelectedComponentForDetail(null)}
        onSelect={handleSelectComponent}
        onRemove={handleRemoveComponent}
        isSelected={isComponentSelected}
      />
    </div>
  );
}
