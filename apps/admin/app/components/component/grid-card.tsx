import { ListComponentsSchema } from "@repo/api/models";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Edit, MoreVertical, Star, Trash2 } from "lucide-react";
import { useComponent } from "../../hooks/useComponent";
import Image from "next/image";

interface Props {
  component: ListComponentsSchema[number];
  onEdit?: (component: ListComponentsSchema[number]) => void;
  onDelete?: (componentId: number, componentName: string) => void;
}

export default function ComponentGridCard({
  component,
  onDelete,
  onEdit,
}: Props) {
  const { componentTypeColors, getKeySpecs, componentTypeIcons } =
    useComponent();

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <Badge
            variant="outline"
            className={componentTypeColors[component.type] || ""}
          >
            {component.type}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(component)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(component.id, component.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Component Icon/Image Placeholder */}
        <div className="flex aspect-square items-center justify-center rounded-lg bg-muted/50">
          {component.imageUrl ? (
            <Image
              src={component.imageUrl}
              alt={component.name}
              width={80}
              height={80}
              className="object-contain w-full h-full"
            />
          ) : componentTypeIcons[component.type] ? (
            <span className="text-6xl">
              {componentTypeIcons[component.type]}
            </span>
          ) : (
            <div className="h-20 w-20 rounded-md bg-muted-foreground/10" />
          )}
        </div>

        {/* Component Name */}
        <div>
          <CardTitle className="line-clamp-2 text-base">
            {component.name}
          </CardTitle>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs">1,299</span>
          </div>
        </div>

        {/* Key Specifications */}
        <div className="space-y-1">
          {getKeySpecs(component).map((spec, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground capitalize">
                {spec.label}
              </span>
              <span className="font-medium">{String(spec.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-green-600 dark:text-green-500">
            In Stock
          </span>
        </div>
        <div className="text-lg font-bold">${component.price.toFixed(2)}</div>
      </CardFooter>
    </Card>
  );
}
