import { Button } from "@/components/ui/button"

function Reset() {
  return (
    <div className="container mx-auto flex justify-center pb-5">
      <Button variant="outline" onClick={()=>{window.location.reload()}}>Reset</Button>
    </div>
  )
}

export default Reset
