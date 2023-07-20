import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { createContext, useState } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from 'zod'


interface Cycle{
  id: string,
  task: string,
  minutesAmount:number,
  startDate: Date,
  interruptedDate?: Date,
  finishedDate?: Date,

} 

interface CyclesContextType{
  activeCycle: Cycle | undefined,
  activeCycleId: string | null,
  markCurrentCycleAsFinished :() => void,
  amountSecondsPassed: number,
  setSecondsPassed: (seconds:number)=> void, 
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleFormValidationSchema = z.object({
    task: z.string().min(1, 'Informe a tarefa'),
    minutesAmount:z.number().min(1, 'O ciclo precisa ser de no minimo 5 minutos.').max(60, 'O ciclo precisa ser de no máximo 60 minutos.')
  })
   
  type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

  const newCycleForm  = useForm<NewCycleFormData>({
    resolver:zodResolver(newCycleFormValidationSchema),
    defaultValues:{
      task:'',
      minutesAmount: 0,
    }
  })

  const {handleSubmit, watch, formState, reset} = newCycleForm

  if(formState.errors.minutesAmount?.message){
    alert(formState.errors.minutesAmount?.message)
  }else if(formState.errors.task?.message){
    alert(formState.errors.task?.message)
  }
  
  function setSecondsPassed(seconds:number){
    setAmountSecondsPassed(seconds)
  }
 
  function handleCreateNewCycle(data:NewCycleFormData){
    const id = String(new Date().getTime())
    const newCycle:Cycle = {
      id: id,
      task: data.task,
      minutesAmount:data.minutesAmount,
      startDate :new Date()
    }
    setCycles((state) => [...state,newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    reset()
  }

  function handleInterruptCycle(){
    setCycles(state => state.map(cycle =>{
      if(cycle.id === activeCycleId){
        return {... cycle, interruptedDate: new Date()}
      } else{
        return cycle
      }
    }))
    setActiveCycleId(null)
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  
  const task = watch('task')
  const isSubmitDisabled = !task

  function markCurrentCycleAsFinished(){
    setCycles(state => state.map((cycle) =>{
      if(cycle.id === activeCycleId){
        return {...cycle, finishedDate:new Date()}
      } else{
        return cycle
      }
     }),)
  }

  return (
    
    <HomeContainer>
      <form onSubmit = {handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}>
          <FormProvider {... newCycleForm}>
            <NewCycleForm/>
          </FormProvider>
          <Countdown/>
        </CyclesContext.Provider>

        

        { activeCycle ?(
        <StopCountdownButton onClick={handleInterruptCycle} type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
        ) : (
        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
