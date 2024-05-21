import { PersonnelTrainingSchema } from "@/schemas/personnelDefinitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function PersonalInformation() {
  const personnelForm = useForm<z.infer<typeof PersonnelTrainingSchema>>({
    resolver: zodResolver(PersonnelTrainingSchema),
    // defaultValues: {
    //   username: "",
    // },
  });

  return <div></div>;
}
