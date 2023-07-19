import { useForm } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from 'zod'

export function NewCycleForm(){

  const newCycleFormValidationSchema = z.object({
    task: z.string().min(1, 'Informe a tarefa'),
    minutesAmount:z.number().min(1, 'O ciclo precisa ser de no minimo 5 minutos.').max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
  })
   
  type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

  const {register, handleSubmit, watch, formState, reset} = useForm<NewCycleFormData>({
    resolver:zodResolver(newCycleFormValidationSchema),
    defaultValues:{
      task:'',
      minutesAmount: 0,
    }
  })

  if(formState.errors.minutesAmount?.message){
    alert(formState.errors.minutesAmount?.message)
  }else if(formState.errors.task?.message){
    alert(formState.errors.task?.message)
  }
  
    return(
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestion"
            disabled={!!activeCycle}
            placeholder="De um nome para o seu projeto"
            {...register('task')}
          />
          
          <datalist id="task-suggestion">
            <option value="Projeto 1" />
          </datalist>
          <label htmlFor="minutesAmount">Durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', {valueAsNumber:true})}
          />

          <span>minutos.</span>
        </FormContainer>
    )
}