# YCB Query

The **YCB Query** language is used in combo modules created in the combo editor. 

A query is simply a line of text that explains what card(s) you are looking for. 
There are a few ways of finding a match which I'll show you below. 


## Exact Match (ID)

If there is only a single card you wish to match, you can use the card's ID as the entire query. 

Example: Otoshidamashii

```ycb
101104031
```

## Field Matching

To match multiple cards that match a particular description, you can use field matching. 
Field matching takes something about a card (such as the name) and compares it to the given value for that field.
Each field is essentially a piece of information about the card. 

Example: Matches all cards with `melffy` in the name (not type sensitive)

```ycb
name=melffy
```

You can match multiple fields at once by using a comma between each pair. 

```ycb
name=melffy,type=spell
```

## Arrays

In a YCB file you will be able to create arrays. 
Arrays are a list of querys.
If one query in an array matches a card, it will be accepted as a valid card.
You can use an array with the `arrays.` prefix followed by the array's name.

For example: I have an array named `starters` and want to match a card if it is in the array.

```ycb
arrays.starters
```

## Fields & Values

- `name` will match any card who's name includes the value given
- `desc` will match any card who's card text includes the value given
- `type` will match any card who's card type includes the value given (`spell` as a value matches `Spell Card`)
- `race` will match any monster who's type includes the value given
- `atk` will match any monster who's attack is equal to the value given
- `def` will match any monster who's defence is equal to the value given
- `level` will match any monster who's level is equal to the value given
- `attribute` will match any monster who's attribute includes the value given
- `linkval` will match any monster who's link value is equal to the value given

If you think I have missed out a field, please open an issue on [GitHub](https;//github.com/TheOtterlord/deckmaster/issues).
