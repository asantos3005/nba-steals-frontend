import basketballCourt from "../assets/court.svg";
import dribbleSilhouette from "../assets/dribbling-silhouette-no-ball.png";
import hoop from "../assets/hoop.png";



export default function HeroLanding(){
    return(
        <section className="min-h-[100svh] bg-mauve-900 relative flex flex-col-reverse items-center">
            <div className="flex flex-col items-center justify-center">
                <img
                    src={hoop}
                    alt="basketball hoop"
                    className="w-[25svw] object-cover mb-[-5svh]"
                />
                <img
                    src={basketballCourt}
                    alt="Basketball court"
                    className="w-[100svw] object-cover"
                />            
            </div>
                <h1 className="text-4xl font-bold text-white">NBA Steals</h1>

        </section>
    )
}
