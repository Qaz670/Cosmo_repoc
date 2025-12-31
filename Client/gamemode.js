let seeker = null;

Game.Events.OnRoundStart.Add(() => {

  const players = Game.Players.GetAll();
  if (players.length < 2) return;

  // выбираем искателя
  seeker = players[Math.floor(Math.random() * players.length)];

  players.forEach(p => {

    p.Inventory.Clear();

    if (p === seeker) {
      p.Inventory.Give("Knife");
      p.State.SetSpeed(1.1);
      p.State.SetFrozen(true);

      p.Ui.ShowHint("Ты ИСКАТЕЛЬ!\nПодожди 10 секунд", 10);
    } else {
      p.State.SetSpeed(1.0);
      p.Ui.ShowHint("ПРЯЧЬСЯ!\nВыживи до конца раунда", 10);
    }
  });

  Game.Ui.ShowGlobalMessage("Прятки начались!");

  // задержка для искателя
  Game.Timers.SetTimeout(() => {
    if (seeker && seeker.IsAlive) {
      seeker.State.SetFrozen(false);
      seeker.Ui.ShowHint("ИЩИ ВСЕХ!", 5);
      Game.Ui.ShowGlobalMessage("Искатель вышел!");
    }
  }, 10000);
});


// смерть игрока
Game.Events.OnPlayerDeath.Add((victim, killer) => {

  if (!seeker) return;

  // убил искатель
  if (killer === seeker && victim !== seeker) {
    victim.State.SetSpectator(true);
  }

  // проверка живых прячущихся
  const aliveHiders = Game.Players
    .GetAll()
    .filter(p => p !== seeker && p.IsAlive);

  if (aliveHiders.length === 0) {
    Game.Round.End("ИСКАТЕЛЬ ПОБЕДИЛ");
  }
});


// если время вышло
Game.Events.OnRoundTimeEnd.Add(() => {
  Game.Round.End("ПРЯЧУЩИЕСЯ ПОБЕДИЛИ");
});


// очистка
Game.Events.OnRoundEnd.Add(() => {
  seeker = null;
});

