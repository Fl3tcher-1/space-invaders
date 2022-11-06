# space-invaders

Objectives

Here are some of the features you want to implement in your game:

    Game runs at at least 60 FPS at all times
    No frame drops!
    Proper use of RequestAnimationFrame
    It is very hard to predict performances in JS. So measure performances to see if your code is fast. This will be tested!
    Pause menu, that includes:
        Continue
        Restart
    A score board that displays the following metrics:
        Countdown clock or Timer that will indicate the amount of time the player has until the game ends or the time that the game has been running
        Score that will display the current score (XP or points)
        Lives that shows the number of lives that the player has left

You must not use frameworks or canvas, the game must be implemented using plain JS/DOM and HTML only
Instructions

Animation must have consistent motion, so in order to have a smooth animation (without interruptions or so called jank animation) you must achieve the special number, 60 FPS. You can see more about performance here

In order to play the game the player must only use the keyboard. The controls must be smooth, in other words you should not need to spam a key to take actions in the game. Instead, for example, if a key is kept pressed, the player must continue to do the relevant action. If the key is released the player should stop doing the action.

Basically, motions triggered by a key must not jank or stutter.

For the pause menu you must be able to pause, restart, and continue the game whenever you want to do so. The frames should not drop if paused.
Pre-Approved List

Your game will have to respect the genre of one of these games listed below. In other words, the main goal of the game has to be similar to one of these:

    Bomberman
    Flipper/ Pinball
    Space Invaders
    Donkey Kong
    Brick Breaker/ Arkanoid
    Pac-Man
    Super Mario
    Tetris
    Duck Hunt
