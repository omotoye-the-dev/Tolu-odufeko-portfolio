import Biosection from "@/component/sections/Biosection";
import Featuredsection from "@/component/sections/Featuredsection";
import Herosection from "@/component/sections/Herosection";
import Howtohelp from "@/component/sections/Howtohelp";
import Latestarticlesection from "@/component/sections/Latestarticlesection";

export default function Home() {
  return (
    <>
    <Herosection/>
    <Biosection/>
    <Featuredsection/>
    <Latestarticlesection/>
    <Howtohelp/>
    </>
  );
}
