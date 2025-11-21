import { ListComponentsSchema } from "@repo/api/models";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useComponent } from "../../hooks/useComponent";

interface Props {
  component: ListComponentsSchema[number];
  onEdit?: (component: ListComponentsSchema[number]) => void;
  onDelete?: (componentId: number, componentName: string) => void;
}

export default function ComponentListCard({
  component,
  onDelete,
  onEdit,
}: Props) {
  const { componentTypeColors, componentTypeIcons } = useComponent();

  return (
    <Card key={component.id}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-1 items-center gap-4">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
            <span className="text-3xl">
              {componentTypeIcons[component.type]}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{component.name}</h3>
              <Badge
                variant="outline"
                className={componentTypeColors[component.type] || ""}
              >
                {component.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Updated {new Date(component.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${component.price.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-500">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              In Stock
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
      </CardContent>
    </Card>
  );
}
