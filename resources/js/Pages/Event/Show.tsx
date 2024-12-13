import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import { Donation, Event } from "@/types";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import * as Avatar from "@radix-ui/react-avatar";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { toast } from "sonner";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";

interface PageProps extends InertiaPageProps {
  event: Event;
  donators: Donation[] | { data: Donation[] };
}

export default function Show() {
  const { props } = usePage<PageProps>();
  const event = props.event;
  const donators = Array.isArray(props.donators)
    ? props.donators
    : props.donators.data || [];

  const { data, setData, post, processing, errors, reset } = useForm({
    amount: "",
    event_id: event.id,
    date: undefined as Date | undefined,
  });

  const handlePresetAmount = (presetAmount: number) => {
    setData("amount", presetAmount.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...data,
      date: data.date ? format(data.date, "yyyy-MM-dd") : undefined,
    };
    post(route("donation.store"), {
      data: formattedData,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Donation submitted successfully!");
        reset("amount", "date");
      },
      onError: (errors) => {
        if (errors.amount) {
          toast.error(errors.amount);
        } else if (errors.date) {
          toast.error(errors.date);
        } else {
          toast.error("An error occurred while submitting your donation.");
        }
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Event Details" />
      <div className="py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="mb-4 flex items-center w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1">Back</span>
          </button>
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 pt-4">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full rounded-md"
            />
          </div>
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-semibold text-green-800 dark:text-green-200">
              {event.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mt-4 space-y-4">
              {event?.description.split("\n").map((paragraph, index) => (
                <p key={index} className="text-justify">
                  {paragraph}
                </p>
              ))}
            </p>

            <div className="flex flex-col lg:flex-row mt-10 gap-6 lg:gap-10">
              <Card className="w-full lg:w-1/3 lg:shrink-0">
                <CardHeader>
                  <CardTitle>List Donators</CardTitle>
                  <CardDescription>
                    Most active contributors this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {donators.length > 0 ? (
                    <div className="space-y-4">
                      {donators.map((donator) => (
                        <div
                          key={donator.id}
                          className="flex items-center space-x-4"
                        >
                          <Avatar.Root>
                            <Avatar.Image
                              src={donator.user.image}
                              alt={donator.user.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                            <Avatar.Fallback className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              {donator.user.name.charAt(0)}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium leading-none">
                              {donator.user.name}
                            </p>
                          </div>
                          <div className="font-medium">
                            Rp {donator.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      <p className="text-gray-600 text-base sm:text-lg mb-2 font-bold">
                        No Donations Yet
                      </p>
                      <p className="text-gray-500 text-sm text-center">
                        Be the first to support this event! Your contribution
                        can make a difference.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="w-full lg:w-2/3">
                <CardHeader>
                  <CardTitle className="text-center text-xl sm:text-2xl mb-4">
                    Donate Here
                  </CardTitle>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-2 py-4">
                      {[5000, 10000, 20000, 50000, 100000, 500000].map(
                        (preset) => (
                          <Button
                            key={preset}
                            type="button"
                            className="bg-green-500 hover:bg-green-600 text-sm sm:text-base"
                            onClick={() => handlePresetAmount(preset)}
                          >
                            Rp {preset.toLocaleString()}
                          </Button>
                        )
                      )}
                    </div>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Custom amount.."
                      value={data.amount}
                      onChange={(e) => setData("amount", e.target.value)}
                      className="w-full mt-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.amount}
                      </p>
                    )}
                    <div className="mt-4">
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Donation Date
                      </label>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={data.date}
                          onSelect={(newDate) => setData("date", newDate)}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full mt-4 py-2 text-base sm:text-lg"
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Submit Donation"}
                    </Button>
                  </form>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
