import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

import { useContext } from "react";
import { CyclesContext } from "../..";
import { useFormContext } from "react-hook-form";

export function NewCycleForm(){
  const {activeCycle} = useContext(CyclesContext)
  const {register } = useFormContext()

  
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