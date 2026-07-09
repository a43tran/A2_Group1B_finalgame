# A2: Mid-Term Game
# Group 1B

## Illuminate



## Design Rationale



## Setup and Interaction Instructions
To run the sketch locally, open `index.html` in Google Chrome using Live Server. To play via GitHub Pages, visit the link provided on the submission page.

**Game Objective**
The goal of Illuminate's first level is to find and make your way to the school, while simultaneously avoiding all the laser cameras that will decrease the social battery bar, essentially the health bar, if you make contact. The lower your social battery is, the slower you walk, the more caved in the walls are, and the more vulnerable you are to colliding into the laser cameras given your slowed walking speed. Scattered around the map, you can locate glowing fireflies that once all collected, will grant you a special badge. Collecting fireflies is not mandatory to arrive and access the school.

**Controls:** 
WASD to move.

- W move/walk forward
- A move/walk to the left
- S move/walk backwards
- D move/walk to the right
- Spacebar to start game, progress through introduction dialogue
- Mouse1 to click through the menu, access the ? (controls), progress through introduction dialogue
- R restart the game after full social battery depletion
- N progress to next level



## Iteration Notes

### **Post-Playtest**
**Laser Camera Mechanic**
After receiving feedback in A2 playtesting, our group replaced the moving black balls with a series of stationary laser cameras that release a stream of beaming red light. Once players make contact with the laser, such as walking through them, their social battery bar decreases. We conducted this change to reduce the difficulty of the tutorial/first level, where users are first grasping Illuminate’s core game mechanics and objective. Rather than fixating on evading the moving black balls, players can take their time to explore different pathways in the maze to arrive at school and confront expanding walls as their social battery diminishes. The laser camera also serves as a metaphor that represents the sense of being monitored and judged by others as players navigate through, reflecting the integration of social anxiety disorder in the gameplay where individuals fear being monitored and experiencing intense scrutiny in social situations.

**Shrinking Walls to Battery Depletion**
In the initial game, the expanding walls solely served as a visual effect that moved and followed the player as they progressed through the maze. Players’ social battery could only be damaged by making contact with the moving black balls. However, our group’s observations from our A2 playtesting led us to reinforce the connection between the maze walls’ expansion and the player’s social battery bar. As the player’s social battery decreases when they collide with the laser camera, the walls gradually expand with every occurrence of which the laser beam hits the player. Once the player’s social battery is fully depleted, the walls expand fully and lock the player in place, preventing them from further moving through the maze. Locked in a stagnant position, players are then presented with a restart screen and must begin from the starting point again. As the walls expand, the path becomes more narrow, increasing the difficulty of smoothly moving through each desired route. By manipulating the maze environment, this mechanic conveys a sense of constriction as anxiety intensifies in one’s body, physically freezing them in place once they have burnt out.

**Firefly Collectibles**
Prior to A2 playtesting, players simply progressed through the maze’s pathways to reach the final end point, represented through a school. To strengthen the game’s overall engagement, our group implemented flying fireflies as a collectible scattered throughout the map that players must collect. After collecting all 11 fireflies, players receive a special badge stored in their inventory (on the top right side of the screen) of which our group intends to place on the player’s backpack (in the character sprite). The fireflies are not mandatory to complete the level, but serve as an additional incentive that encourages players to actively explore different routes throughout the map. As glowing fireflies in the dark forest, these collectibles reflect a sense of light and comfort as insects that the character, Faith, has befriended and enjoys collecting in her jar as a daily routine. For her, the fireflies are predictable and familiar insects she encounters on her pathway to school and other locations in this game world. 


### **Post-Showcase**
**Laser Camera Imagery**
Based on our Mid-Term game showcase, a planned improvement we intend to implement is replacing the imagery of a laser camera with a more fitting image, such as Goblin with laser beams projected from its eyes as recommended by Karen and Jueun. As our game’s theme exudes a whimsical atmosphere and natural environment filled with a rich pattern of forestry and fireflies, the laser cameras disrupt the visual cohesion as a prominent sci-fi element. Through a goblin or mystical creature with a strong laser-beamed gaze, we plan to have the creature rotate, looking from side to side to enlarge the scope of which players’ social battery bar can take damage. To further strengthen the game's visual clarity, we will increase our fonts' visibility as during the showcase, people had difficulty reading the dialogue and heads-up display text. Larger text sizes would improve contrast, assisting players in understanding the game's objectives and mechanics more easily and partaking in a smoother gameplay experience.

**Fireflies Boost Social Battery**
Another planned improvement our group is considering is adding more purpose to the firefly collectibles as they initially served as an optional collectible players can accumulate as they navigate through different routes in the maze. Rather than having eleven fireflies scattered throughout the map, Karen and Jueun suggested decreasing this amount and re-interpreting the fireflies as a collectible that boosts the player’s social battery bar, providing a form of light energy that energizes the player. By incorporating this feature, players not only have a greater incentive to collect the fireflies, but also gain the opportunity to replenish their depleted social battery and reach the endpoint without having to restart again. We also will remove the firefly counter to maintain a sense of mystery/unknown where players are not aware of how many fireflies/social battery boosters are available. Through this iteration, discovering the fireflies becomes more meaningful as encountering these glowing creatures restores the damage that players have taken rather than existing simply as a collectible count. 

## Assets

|               File                |                                   Source                                  |
|-----------------------------------|---------------------------------------------------------------------------|
| `assets/images/walking.mp3`[1]    | Abdalrahman_bm, 8-bit gravel footsteps 1 - Pixabay.com                    |
| `assets/images/collect.mp3`[4]    | floraphonic, 90s Game UI 6 - Pixabay.com                                  |
| `assets/images/win.mp3`[5]        | Latent-Rick, Retro Arcade Level Up - Pixabay.com                          |
| `assets/images/fail.mp3`[6]       | Make_More_Sound, 8 Bit Video Game Lose Sound - Version 1 - Pixabay.com    |
| `assets/images/win.mp3`[5]        | Latent-Rick, Retro Arcade Level Up - Pixabay.com                          |
| `assets/images/fail.mp3`[6]       | Make_More_Sound, 8 Bit Video Game Lose Sound - Version 1 - Pixabay.com    |       

## References

Bibliography

[1]
Abdalrahman_bm. 2025. 8-bit gravel footsteps 1. Pixabay.com. Retrieved July 9, 2026 from https://pixabay.com/sound-effects/film-special-effects-8-bit-gravel-footsteps-1-408582/
[2]
Cleveland Clinic. 2026. Social Anxiety Disorder. Cleveland Clinic. Retrieved July 8, 2026 from https://my.clevelandclinic.org/health/diseases/22709-social-anxiety
[3]
Karen Cochrane. 2026. Week 3 Code Examples. Retrieved July 8, 2026 from https://learn.uwaterloo.ca/d2l/le/content/1265815/viewContent/6544450/View
[4]
floraphonic. 2024. 90s Game UI 6. Pixabay.com. Retrieved June 22, 2026 from https://pixabay.com/sound-effects/film-special-effects-90s-game-ui-6-185099/
[5]
Latent-Rick. 2026. Retro Arcade Level Up. Pixabay.com. Retrieved June 22, 2026 from https://pixabay.com/sound-effects/musical-retro-arcade-level-up-552982/
[6]
Make_More_Sound. 2023. 8 Bit Video Game Lose Sound - Version 1. Pixabay.com. Retrieved June 22, 2026 from https://pixabay.com/sound-effects/film-special-effects-8-bit-video-game-lose-sound-version-1-145828/
[7]
Mayo Clinic . 2021. Social anxiety disorder (social phobia). Mayo Clinic. Retrieved July 8, 2026 from https://www.mayoclinic.org/diseases-conditions/social-anxiety-disorder/symptoms-causes/syc-20353561
[8]
Montogoronto. 2025. A night full of stars - Peaceful electronic 8-bit/piano track | Royalty-free Music. Pixabay.com. Retrieved July 9, 2026 from https://pixabay.com/music/ambient-a-night-full-of-stars-peaceful-electronic-8-bitpiano-track-321551/
[9]
Pixabay. 2026. Retro Hurt Sound 01. Pixabay.com. Retrieved June 22, 2026 from https://pixabay.com/sound-effects/retro-hurt-sound-01-474779/



