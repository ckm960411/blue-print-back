export interface CreateExerciseReqDto {
  userId: number;
  exerciseTypeId: number;
  date: Date;
  count?: number;
  description?: string;
}
