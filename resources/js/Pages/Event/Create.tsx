import { useState, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { CalendarIcon, ChevronLeft, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function Create() {
  const [date, setDate] = useState<Date>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors, progress } = useForm({
    title: "",
    description: "",
    date: "",
    image: null as File | null,
    donationGoal: "",
    location: "",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("event.store"), {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setData("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create New Event" />

      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="mb-4 flex items-center w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Back</span>
          </button>
          <Card className="overflow-hidden bg-white shadow-sm dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-green-800 dark:text-green-200">
                Create New Event
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setData(
                            "date",
                            newDate ? format(newDate, "yyyy-MM-dd") : ""
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donationGoal">Donation Goal</Label>
                  <Input
                    id="donationGoal"
                    type="number"
                    value={data.donationGoal}
                    onChange={(e) => setData("donationGoal", e.target.value)}
                    required
                  />
                  {errors.donationGoal && (
                    <p className="text-sm text-red-500">
                      {errors.donationGoal}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={data.location}
                    onChange={(e) => setData("location", e.target.value)}
                    required
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={data.category}
                    onValueChange={(value) => setData("category", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(null);
                            setData("image", null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p>
                          Drag and drop an image here, or click to select a file
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  {errors.image && (
                    <p className="text-sm text-red-500">{errors.image}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={processing}
                >
                  {processing ? "Creating..." : "Create Event"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
