import Keys from "./Keys";
import { create } from "zustand";

// Zustand store
type ResultStore = {
    answer: string;
    appendValue: (val: string) => void;
    clear: () => void;
    evaluated:boolean;
    allClear: () => void;
    evaluate: () => void;
};

const useResultStore = create<ResultStore>((set, get) => ({
    answer: "",
    evaluated:false,
    appendValue: (val) => {
        const {answer,evaluated}=get();
        if (evaluated)
        {
         set({ answer: val, evaluated: false });   
         return;
        }
        set({ answer: answer + val });
    },
    clear: () => {
        const current = get().answer;
        set({ answer: current.slice(0, -1) });
    },
    allClear: () => set({ answer: "", evaluated:false}),
    evaluate: () => {
        try {
            const result = eval(get().answer);
            set({ answer: result.toString() , evaluated: true});
        } catch {
            set({ answer: "Error" });
        }
    },
}));

const Calculator = () => {
    const { answer, appendValue, clear, allClear, evaluate } = useResultStore();

    const keys = [
        "AC","C","%","-","7","8","9","+","4","5","6","/","1","2","3", "*","0", ".","^","=",
    ];

    const handleClick = (key: string) => {
        if (key === "AC") allClear();
        else if (key === "C") clear();
        else if (key === "=") evaluate();
        else if (key === "^") appendValue("**");
        else appendValue(key);
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="bg-gray-700 h-125 w-100 rounded-2xl flex-col p-4">
                <label
                    htmlFor="calc"
                    className="flex justify-center font-bold text-4xl mt-5 text-white"
                >
                    Calculator
                </label>
                <label
                    htmlFor="ans"
                    className="flex justify-end text-white font-bold text-4xl mt-5 border-2 h-14 px-4 py-1.5 rounded overflow-x-auto bg-black"
                >
                    {answer || "0"}
                </label>
                <div>
                    <div className="grid grid-cols-[repeat(4,1fr)] text-2xl mt-12 gap-2">
                        {keys.map((item, index) => (
                            <Keys label={item} key={index} onClick={() => handleClick(item)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
