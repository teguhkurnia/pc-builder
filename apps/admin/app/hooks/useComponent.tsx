import { ListComponentsSchema } from "@repo/api/models";

export const useComponent = () => {
  const componentTypeColors: Record<string, string> = {
    CPU: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MOTHERBOARD: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    RAM: "bg-green-500/10 text-green-500 border-green-500/20",
    STORAGE: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    GPU: "bg-red-500/10 text-red-500 border-red-500/20",
    PSU: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CASE: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    COOLING: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  };

  // Get key specifications for display
  const getKeySpecs = (component: ListComponentsSchema[number]) => {
    const specs = component.specifications as Record<string, any>;
    const keys = Object.keys(specs as Record<string, unknown>).slice(0, 3);
    return keys.map((key) => ({
      label: key,
      value: (specs as Record<string, unknown>)[key],
    }));
  };

  const componentTypes = [
    "all",
    "CPU",
    "MOTHERBOARD",
    "RAM",
    "STORAGE",
    "GPU",
    "PSU",
    "CASE",
    "COOLING",
  ];
  const componentTypeIcons: Record<string, string> = {
    CPU: "🖥️",
    MOTHERBOARD: "🔌",
    RAM: "💾",
    STORAGE: "💿",
    GPU: "🎮",
    PSU: "⚡",
    CASE: "📦",
    COOLING: "❄️",
  };

  return {
    componentTypeColors,
    getKeySpecs,
    componentTypes,
    componentTypeIcons,
  };
};
