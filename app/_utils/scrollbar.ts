
export function ScrollBar({addUtilities}:{addUtilities:Function}){
    const newUtilities = {
        ".scrollbar-none::-webkit-scrollbar":{
            display: "none",
        },
        ".scrollbar-none": {
            "-ms-overflow-style":"none",
            "scrollbar-width":"none"
        },
        ".scrollbar-thin::-webkit-scrollbar":{
            width: 6,
        },
        ".scrollbar-track::-webkit-scrollbar-track": {
            "border-width": 1,
            "border-color": "#000",
            "border-style": "solid",
            "border-radius": 10
        },
        ".scrollbar-thumb-black::-webkit-scrollbar-thumb": {
            background: "#555",
            "border-radius": 10,
        },
        ".scrollbar-thumb-black::-webkit-scrollbar-thumb:hover": {
            background: "#999",
            cursor: "pointer",
        }
    };
    addUtilities(newUtilities)
}
