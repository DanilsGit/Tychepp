import { useEffect, useState } from "react";
import { useAuthStore } from "../../login/stores/authStore";
import { supabase } from "../../../lib/supabase";
import { EmployeeProfile } from "../../../types/rowTypes";

export const useGetMyEmployees = (restaurantId: string) => {
  const { profile } = useAuthStore();
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployees();

    const employee = supabase
      .channel("insert_employee")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "employee" },
        async (payload) => {
          const newEmployee = await getEmployeeProfile(payload.new.id);
          if (newEmployee) {
            setEmployees((prev) => [...prev, newEmployee]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(employee);
      setEmployees([]);
    };
  }, [profile, restaurantId]);

  const getEmployees = async () => {
    const { data, error } = await supabase
      .from("employee")
      .select("*, profiles(*)")
      .eq("restaurant_id", restaurantId);

    if (error) {
      console.error("Error fetching employees:", error);
      setIsLoading(false);
      return;
    }

    if (data) {
      setEmployees(data);
    }

    setIsLoading(false);
  };

  const getEmployeeProfile = async (employeeId: string) => {
    const { data, error } = await supabase
      .from("employee")
      .select("*, profiles(*)")
      .eq("id", employeeId)
      .single();

    if (error) {
      console.error("Error fetching employee profile:", error);
      return null;
    }

    return data as EmployeeProfile;
  };

  return {
    employees,
    isLoading,
  };
};
