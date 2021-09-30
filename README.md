# ScoreBot

## Description

ScoreBot is a GroupMe bot that keeps a scoreboard for all the members in a group
through means such as `/add`.

## Commands

- `/add [point amount]` - Will increment the caller's (message sender) score by
the specified amount. If no amount is specified, the score will increase by 1.
- `/scores` - Will display all member's names and score in an arbitrary order.

## Deployment

ScoreBot can be hosted on any cloud computing platform that supports Node.js.  
I chose to use Heroku, connected through GitHub auto deploy.  
The server can be started with the command `npm start`.

## Score Storage

The scores are stored in json file with the following format:

```json
{
    "id": {
        "name": "Trevor",
        "score": 39
    }
}
```
