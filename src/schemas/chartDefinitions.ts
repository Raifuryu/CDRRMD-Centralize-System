import * as z from "zod";

export const PieDataSchema = z.object({
  status: z.string(),
  training: z.number(),
  fill: z.string(),
});

export const PieChartPropsSchema = z.object({
  data: z.array(PieDataSchema),
  filters: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
});
