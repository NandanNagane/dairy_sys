import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Milk,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { userAPI } from "../../services/userService";
import { milkCollectionAPI } from "../../services/milkCollectionService";
import { toast } from "sonner";

// Validation schema
const milkCollectionSchema = z.object({
  farmerId: z.string().min(1, "Please select a farmer"),
  shift: z.enum(["MORNING", "EVENING"], {
    required_error: "Please select a shift",
  }),
  quantity: z
    .number()
    .min(0.1, "Quantity must be greater than 0")
    .max(1000, "Quantity seems too high"),
  fat: z
    .number()
    .min(0.1, "Fat must be greater than 0")
    .max(10, "Fat content must be between 0-10%"),
  snf: z
    .number()
    .min(0, "SNF cannot be negative")
    .max(12, "SNF content must be between 0-12%")
    .optional()
    .or(z.nan())
    .transform((val) => (isNaN(val) ? undefined : val)),
});

const MilkCollectionForm = ({ rateCard, onSubmit, onSaveAndNext }) => {
  const [payoutEstimate, setPayoutEstimate] = React.useState(0);
  const [qualityWarning, setQualityWarning] = React.useState(null);
  const [isDuplicate, setIsDuplicate] = React.useState(false);
  const [farmers, setFarmers] = React.useState([]);
  const [loadingFarmers, setLoadingFarmers] = React.useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(milkCollectionSchema),
    defaultValues: {
      shift: "MORNING",
    },
  });

  const quantity = watch("quantity");
  const fat = watch("fat");
  const snf = watch("snf");
  const farmerId = watch("farmerId");

  // Fetch farmers on component mount
  React.useEffect(() => {
    const fetchFarmers = async () => {
      setLoadingFarmers(true);
      try {
        const response = await userAPI.getAllUsers({ role: "FARMER" });
        setFarmers(response.users || []);
      } catch (error) {
        console.error("❌ Failed to load farmers:", error);
        if (error.response?.status === 401) {
          toast.error("Authentication failed. Please try logging in again.");
        } else {
          toast.error(error.response?.data?.error || "Failed to load farmers");
        }
      } finally {
        setLoadingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);

  // Calculate payout estimate
  React.useEffect(() => {
    if (quantity > 0 && fat >= 0 && snf >= 0) {
      // Simple rate calculation: base rate + (fat bonus) + (snf bonus)
      const baseRate = 35; // ₹35 per liter base
      const fatBonus = fat > 4 ? (fat - 4) * 3 : 0;
      const snfBonus = snf > 8 ? (snf - 8) * 2 : 0;
      const rate = baseRate + fatBonus + snfBonus;
      const estimate = quantity * rate;
      setPayoutEstimate(estimate);

      // Check for quality outliers
      if (fat < 3.5 || fat > 6) {
        setQualityWarning(`Fat content ${fat}% is unusual. Please verify.`);
      } else if (snf < 8 || snf > 10) {
        setQualityWarning(`SNF content ${snf}% is unusual. Please verify.`);
      } else {
        setQualityWarning(null);
      }
    }
  }, [quantity, fat, snf]);

  const onSubmitForm = async (data) => {
    try {
      console.log("📝 Form data received:", data);

      //not yet implemented need to check duplicate before submit by making api call
      if (isDuplicate) {
        const confirmed = window.confirm(
          "A collection from this farmer already exists for this shift. Do you want to continue?"
        );
        if (!confirmed) return;
      }

      // Prepare collection data with proper types
      const collectionData = {
        farmerId: data.farmerId, // Keep as string (UUID)
        quantity: Number(data.quantity),
        fat: Number(data.fat),
        snf: data.snf ? Number(data.snf) : 8.5, // Default SNF if not provided
      };

      console.log("📤 Sending to API:", collectionData);
      console.log("📊 Data types:", {
        farmerId: typeof collectionData.farmerId,
        quantity: typeof collectionData.quantity,
        fat: typeof collectionData.fat,
        snf: typeof collectionData.snf,
      });

      // If parent provided custom onSubmit, use it; otherwise use default API call
      if (onSubmit) {
        await onSubmit(collectionData);
      } else {
        // Default behavior: call the API directly
        await milkCollectionAPI.createMilkCollection(collectionData);
        toast.success("Milk collection recorded successfully!");

        // Reset form after successful submission
        reset({
          shift: "MORNING", 
          farmerId: "",
          quantity: "",
          fat: "",
          snf: "",
        });
      }
    } catch (error) {
      console.error("❌ Failed to record milk collection:", error);
      toast.error(
        error.response?.data?.error || "Failed to record milk collection"
      );
      throw error;
    }
  };

  const onSaveAndNextClick = async (data) => {
    try {
      await onSubmitForm(data);
      if (onSaveAndNext) {
        onSaveAndNext();
      }
    } catch (error) {
      // Error already handled in onSubmitForm
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Milk className="mr-2 h-5 w-5" />
          Record Milk Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Farmer Selection */}
          <div className="space-y-2">
            <Label htmlFor="farmerId">Farmer</Label>
            {loadingFarmers ? (
              <div className="flex items-center space-x-2 p-3 border rounded-md text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading farmers...</span>
              </div>
            ) : (
              <Select
                onValueChange={(value) => setValue("farmerId", value)}
                disabled={farmers.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      farmers.length === 0
                        ? "No farmers available"
                        : "Select farmer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id.toString()}>
                      {farmer.name} - {farmer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.farmerId && (
              <p className="text-sm text-red-600">{errors.farmerId.message}</p>
            )}
          </div>

          {/* Shift Selection */}
          <div className="space-y-2">
            <Label htmlFor="shift">Shift</Label>
            <Select
              defaultValue="MORNING"
              onValueChange={(value) => setValue("shift", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MORNING">Morning</SelectItem>
                <SelectItem value="EVENING">Evening</SelectItem>
              </SelectContent>
            </Select>
            {errors.shift && (
              <p className="text-sm text-red-600">{errors.shift.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Liters)</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Fat Content */}
          <div className="space-y-2">
            <Label htmlFor="fat">Fat Content (%)</Label>
            <Input
              id="fat"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register("fat", { valueAsNumber: true })}
            />
            {errors.fat && (
              <p className="text-sm text-red-600">{errors.fat.message}</p>
            )}
          </div>

          {/* SNF Content */}
          <div className="space-y-2">
            <Label htmlFor="snf">SNF Content (%)</Label>
            <Input
              id="snf"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register("snf", { valueAsNumber: true })}
            />
            {errors.snf && (
              <p className="text-sm text-red-600">{errors.snf.message}</p>
            )}
          </div>

          {/* Payout Estimate */}
          {payoutEstimate > 0 && (
            <Alert className="bg-green-50 border-green-200">
              {/* <DollarSign className="h-4 w-4 text-green-600" /> */}
              <AlertDescription className="text-green-900">
                <div className="flex items-center justify-between">
                  <span>Estimated Payout:</span>
                  <span className="text-xl font-bold">
                    ₹{payoutEstimate.toFixed(2)}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quality Warning */}
          {qualityWarning && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                {qualityWarning}
              </AlertDescription>
            </Alert>
          )}

          {/* Duplicate Warning */}
          {isDuplicate && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                Duplicate entry detected for this farmer and shift.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Save Collection"}
            </Button>
            {onSaveAndNext && (
              <Button
                type="button"
                onClick={handleSubmit(onSaveAndNextClick)}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                Save & Next
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkCollectionForm;
