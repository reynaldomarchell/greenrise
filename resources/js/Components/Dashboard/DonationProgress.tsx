import { Progress } from "@/Components/ui/progress";

interface DonationProgressProps {
  current: number | null | undefined;
  target: number | null | undefined;
}

export function DonationProgress({ current, target }: DonationProgressProps) {
  const safeTarget = target ?? 0;
  const safeCurrent = current ?? 0;
  const percentage = safeTarget > 0 ? (safeCurrent / safeTarget) * 100 : 0;

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-sm">
        <span>
          {Number(safeCurrent).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          })}{" "}
          raised
        </span>
        <span className="text-muted-foreground">
          {Number(safeTarget).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          })}{" "}
          goal
        </span>
      </div>
    </div>
  );
}
