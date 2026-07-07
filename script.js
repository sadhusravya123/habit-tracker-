let habits = JSON.parse(localStorage.getItem("habits")) || [];

const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", addHabit);

habitInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addHabit();
    }
});

function addHabit(){

    const name = habitInput.value.trim();

    if(name === ""){
        alert("Enter a habit");
        return;
    }

    habits.push({
        id: Date.now(),
        name: name,
        days: Array(30).fill(false)
    });

    habitInput.value="";

    saveHabits();

    renderHabits();

}

function saveHabits(){

    localStorage.setItem("habits",JSON.stringify(habits));

}

function renderHabits(){

    habitList.innerHTML="";

    habits.forEach(habit=>{

        const completed = habit.days.filter(day=>day).length;

        const percent = Math.round((completed/30)*100);

        let streak=0;
        let best=0;

        habit.days.forEach(day=>{

            if(day){
                streak++;
                if(streak>best) best=streak;
            }else{
                streak=0;
            }

        });

        const card=document.createElement("div");

        card.className="habit-card";

        card.innerHTML=`
        <h2>${habit.name}</h2>

        <div class="stats">
            <span>🔥 ${streak}</span>
            <span>🏆 ${best}</span>
        </div>

        <div class="progress">
            Completion: ${percent}%
        </div>

        <div class="calendar">
        ${habit.days.map((day,index)=>`
            <div
            class="day ${day?"completed":""} ${index===29?"today":""}"
            onclick="toggleDay(${habit.id},${index})">
            ${index+1}
            </div>
        `).join("")}
        </div>

        <button
        class="deleteBtn"
        onclick="deleteHabit(${habit.id})">
        Delete Habit
        </button>
        `;

        habitList.appendChild(card);

    });

}

function toggleDay(id,index){

    const habit=habits.find(h=>h.id===id);

    habit.days[index]=!habit.days[index];

    saveHabits();

    renderHabits();

}

function deleteHabit(id){

    if(!confirm("Delete this habit?")) return;

    habits=habits.filter(h=>h.id!==id);

    saveHabits();

    renderHabits();

}

renderHabits();
