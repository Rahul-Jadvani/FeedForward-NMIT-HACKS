
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tractor } from "lucide-react";

export function FarmFeedAlertButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="bg-green-600 transition-all hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
    >
      <Link to="/farmfeed">
        <Tractor className="mr-2 h-4 w-4 transition-transform hover:rotate-6" />
        FARMFEED
      </Link>
    </Button>
  );
}
