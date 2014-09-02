InfectedCompo Design document
=============================

The concept
-----------

The meaning of InfectedCompo is to provide InfectedLAN with a compo system for managing compos and the participants of said compos. InfectedCompo should be a full system for:

 * Registration of teams that will be participating in competitions
 * Managing competition brackets
 * Managing said teams, being able to tell the teams when they will play, and who against.


 Registration of teams
 ---------------------

 The most important feature of InfectedCompo is allowing users to register teams. For this, we need to let people log in, and let them:

  * Create teams for a compo. I suggest limiting to one team per compo, as you can't play in more then one team anyways.
  * Invite players to your team. I suggest this to makee sure nobody comes and says "But... Nobody said you needed a ticket to play!".
  * Watch the current state of the competition they are playing in

Using infected's credentials is an important feature, as it lets us force the participants to purchase a ticket before entering a competition.

The reason to why i am suggesting this "invite players to team", is so any participant of a team can get notifications as to when the match starts. Invitations should have to be acceped by the team players, as i know there has been drama as of who plays with who, so letting one person "set" the team of another sounds like a bad idea



Handling of matches
-------------------

Once a player is registered to a team, having a window in your browser with the compo page should give audio notifications on a incoming match. Instead of a clumbsy way where everyone has to say they are there in a steam chat, what about a "ready" system like the matchmaking in go, where you press ready, and the teams have a timeframe for everyone to press "ready". This way, you have to be on the compo site instead of some infected steam chat that is hard to keep track of.

When the match has started, the site will show a button saying "Done" or something like that. Atleast one team member from each team has to press it. If you press the button, and nobody else on your team has, it will let you state who won. One from each team has to report, to make sure it is valid. If the two people state different results, an admin is called in to validate.

This automates a process that i have experienced as clumbsy at infected earlier.

Aditionally, the compo hosts might have to trigger a game start, and can write some custom text(like server ip) that the teams will see once they have all accepted the game.



Brackets
--------

Another feature would be showing brackets so teams can see who will fight who. This will not be priority, but a nice-to-have.

For this, compo leaders should be able to design brackets and assign users to them(this could also be done automatically). Different type of brackets could be supported, like 1v1, and ffa, where the amount of winners can be set.