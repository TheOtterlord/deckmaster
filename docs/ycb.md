# Yu-Gi-Oh! Combo File Format

The `.ycb` file format is designed to store starting hand combinations that can be used to calculate the overall consistency of a deck.
DeckMaster has a built-in display for these starting hand percentages, and you can add them using a combo module stored in a `.ycb` file.

The `.ycb` format is a JSON formatted document that follows a specific schema. 
In the future I will be implementing a built-in combo editor that removes the need to understand JSON. 
But for now, you must create your own `.ycb` files or import them from a trusted source. 


## Examples

I have written example combo modules that you can use yourself either to test your deck or as inspiration to make your own.

- [Hand Traps](https://github.com/TheOtterlord/deckmaster/examples/hand_traps.ycb)


## Schema

```json
{
  "name": {string} The name of your combo module,
  "format_version": {int} (always 0, will change in the future after 1.0.0),
  "version": {string} The version of your combo module,
  "author": {string} The name of the person who created the module,
  "combos": {list of objects} A list of all combos
    [
      {
        "name": {string} combo name,
        "desc": {string} a description of the combo,
        "turn": {string} can be first or second,
        "variants": {list of objects} all versions of this specific combo (all possible opening hands)
          [
            {
              "tests": {list of objects} all tests that must be true for the combo to be possible
                [
                  {
                    "target": {string} location of the card (can be hand or deck),
                    "query": {string} a ycb query to specify what the card could be,
                    "min": {int} minimum number of cards matching query that need to be in target,
                    "max": {int} maximum number of cards matching query that need to be in target
                  }
                ]
            }
          ]
      }
    ]
}
```


## YCB Query

A YCB query is simply a string of names and values seperated by commas that describe all cards that are allowed in the test.

### Exact Match

If the YCB query is only a card id ("38814750" is Psy-Framegear Gamma), then DeckMaster will automatically match it to just the card that matches the id. 

> NOTE: Do not include any leading 0s. Limit Reverse would be "27551" not "00027551"

### Using Card Data

You can use card data such as the name, level, or card text to match cards. 
The following is an example of a combo test that matches all cards that have a dark attribute.

```json
{
  "target": "hand",
  "query": "attribute=dark",
  "min": 1
}
```

Queries targeting "atk", "def", "level" or "linkval" will compare the exact value. 
All other queries will check to see if your value is included in the exact value. 

For example, this test matches all cards with "tenyi spirit" in the name and are level seven. 

```json
{
  "target": "hand",
  "query": "name=tenyi spirit,level=7",
  "min": 1
}
```

All possible names for card data are as follows. 

- name
- type
- desc
- atk
- def
- level
- race
- attribute
- archetype
- linkval
- scale


## Arrays

If you have one or more combos that need 1 match out of a list of queries, you can use arrays. 
Arrays are shared between all combos in the module. 
If one or more of the queries in the array return `true`, the test will pass.

The following code matches any cards that have 0 attack **or** 0 defense.

```json
{
  "name": "Example array module",
  ...
  "arrays": {
    "my_cardlist": [
      "atk=0",
      "def=0"
    ]
  },
  "combos": [
    {
      "name": "1+ of cards in array",
      "desc": "Chance of opening 1+ card from the array",
      "turn": "first",
      "variants": [
        {
          "tests": [
            {
              "target": "hand",
              "query": "arrays.my_cardlist",
              "min": 1
            }
          ]
        }
      ]
    },
    {
      "name": "2+ of cards in array",
      "desc": "Chance of opening 2+ card from the array",
      "turn": "first",
      "variants": [
        {
          "tests": [
            {
              "target": "hand",
              "query": "arrays.my_cardlist",
              "min": 2
            }
          ]
        }
      ]
    },
    {
      "name": "3+ of cards in array",
      "desc": "Chance of opening 2+ card from the array",
      "turn": "first",
      "variants": [
        {
          "tests": [
            {
              "target": "hand",
              "query": "arrays.my_cardlist",
              "min": 3
            }
          ]
        }
      ]
    }
  ]
}
```
