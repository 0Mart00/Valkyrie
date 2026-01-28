import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const TaskCard = ({ task }: { task: any }) => {
  const priorityColors = {
    LOW: "bg-blue-500",
    MEDIUM: "bg-yellow-500",
    HIGH: "bg-orange-500",
    CRITICAL: "bg-red-600",
  };

  return (
    <Card className="cursor-grab active:cursor-grabbing hover:border-primary transition-all">
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-bold">{task.title}</CardTitle>
          <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description || "Nincs leírás..."}
        </p>
      </CardContent>
    </Card>
  );
};