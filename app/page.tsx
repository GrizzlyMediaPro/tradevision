import { Deals } from "./components/Deals";
import { Firms } from "./components/Firms";

export default function Home() {
  return (
    <div className="page-gradient min-h-screen"> 
      <Deals />
      <Firms />
    </div>
  );
}
