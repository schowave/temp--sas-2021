# DDD, Event-Sourcing und CQRS

- @goloroden
- @thenativeweb


## Domain-Driven Design

- Domain im Fokus
  - Fachlichkeit, Fachgebiet, Thema, …
- "Domain-Driven Design: Tackling Complexity at the Heart of Software"
  - Eric Evans, ~ 2003, "Blue book"
- Einstieg in DDD relativ schwer
  - "Vorgehensweise / Methode für interdisziplinäre Teams, um eine gemeinsame Sprache zu entwickeln / finden."
  - Empathie, Zwischenmenschliches, die Komfortzone verlassen, Kommunikation, Sprache, Semantik, Verständnis, …
- Bausteine
  - Voraussetzung: Anwenderinnen und Anwender haben (fachliche) Ziele
  - Task-orientierte UIs
    - Befehle (drückt Intention aus)

- Commands
  - Verb (Imperativ) + Substantiv
  - "gib die Bestellung auf!", "drucke das Dokument!", "reserviere die Kinokarten!"
  - Name, Parameter
  - Kann abgelehnt werden, hängt von Umständen / Kriterien / Regeln ab
- Domain-Events
  - Substantiv + Verb (Vergangenheit)
  - "die Bestellung wurde aufgegeben", "das Dokument wurde gedruckt", …
  - Name, Parameter
  - Kann nicht rückgängig gemacht werden, solange wir keine Zeitmaschine haben
  - Kann durch Gegenmaßnahmen kompensiert werden, aber nicht rückgängig gemacht werden!
- State
  - Daten, die den aktuellen Zustand der "Welt" repräsentieren

- Never Completed Game
  - Starte Spiel!
  - Beginne Spiel!
  - Eröffne Spiel!
  - Spiele eine Partie!
  - Äußere Vermutung!
  - Löse das Rätsel!
  - Überprüfe meine Vermutung!
  - …

```
DOMAIN
nevercompletedgame

    BOUNDED CONTEXT = Sprachgrenze
    playing

          AGGREGATE = Konsistenzgrenze / Transaktionsgrenze
          game
        +--------------------------------------------------+
        |                   STATE                          |
        |                   isOpened                       |
        |                   currentLevel                   |
        |                   isCompleted                    |
        |                                                  |
        | COMMANDS                          DOMAIN-EVENTS  |
        | openGame                          gameOpened     |
        | makeGuess                         guessMade      |
        |                                   guessWasWrong  |
        |                                   guessWasRight  |
        |                                   levelCompleted |
        |                                   gameCompleted  |
        +--------------------------------------------------+
```

- Commands können einander in die Quere kommen
  - Ergebnis wäre dann eventuell ein inkonsistenter State
  - Lösung: Commands sequenzialisieren
    - Problem: Sequenzialisieren steht Multi-User-Fähigkeit im Weg
      - Lösung: Nicht "alles" locken, sondern kleinere Konsistenz-Bereiche identifizieren
      - Möglichst kleine Bereiche finden, um eine möglichst gute Parallelisierbarkeit zu erreichen
      - Aber: Aufpassen, dass man keine Inkonsistenzen zulässt

- Aggregate
  - (Commands + Domain-Events + State) = Aggregate (= Konsistenzgrenze)
  - Name: Substantiv

- Bounded Context
  - = Namespace, um Begriffskollisionen zu vermeiden
  - "Context" ist ein Hinweis auf "kontextspezifisch", weil Sprache Kontext hat
  - Sprache, die innerhalb eines Bounded Contexts gilt = Ubiquitous Language

- Aufbau einer DDD-Domäne
  - Domain
    - Bounded Contexts
      - Aggregates
        - State
        - Commands
        - Domain-Events


## Event-Sourcing

- CRUD (Create, Read, Update, Delete)
- REST (Post, Get, Put, Delete)

- Bewertung
  - Create: unproblematisch
  - Read  : unproblematisch
  - Update: problematisch (Historie, Audit-Log, …)
  - Delete: problematisch (Undo, Undelete, Storno, …)

- Grundidee von klassischer Datenhaltung: Status Quo speichern, und von Zeit zu Zeit anpassen
- Grundidee von Event-Sourcing: Änderungen (Deltas) speichern, die zum Status Quo geführt haben
  - Auf Create und Read beschränken

```
01.03.2021      Konto eröffnet                              |
02.03.2021      Gehalt eingegangen                +3000     |
04.03.2021      Miete abgebucht                   -1000     |
--------------------------------------------------------- 2000
05.03.2021      Essen gegangen                     -300     | "Replay"
06.03.2021      Lotto gespielt                      -10     |
10.03.2021      Essen gegangen                      -50     |
--------------------------------------------------------- 1640
12.03.2021      Lotto gewonnen                       +5     v
                                                          1645
```

- Vorteile
  - Aktuellen Kontostand
  - Jeden beliebigen Kontostand aus der Vergangenheit
  - Zeitverläufe analyiseren
  - Audit-Log / Historische Daten
  - Reports / Analysen
  - Alternative Realitäten
- Nachteile
  - Replay immer aufwändiger (=> Snapshots)
  - Immer mehr Speicherplatz (=> Snapshots)
  - DSGVO: Recht auf Löschen
  - Events versionieren

- Auswahl einer Eventstore-Datenbank
  - SQL-Datenbank (mit `json`, `blob`, `longtext`, …)
  - NoSQL-Datenbank
  - Spezialdatenbank (EventStoreDB)
  - Anderes (Kafka, …)


## CQRS

- CQS: Design-Pattern ("Command Query Separation")
  - Bertand Meyer
  - Idee: Schreiben und Lesen trennen

```javascript
// Ändert Zustand, gibt nichts zurück (void) => Command
stack.push(23);

// Ändert Zustand nicht, gibt aber etwas zurück => Query
console.log(stack.top());

// Ändert Zustand, gibt etwas zurück => Command + Query => Verletzung von CQS
console.log(stack.pop());
```

- CQRS ist CQS auf Anwendungsebene
  - "Command Query Responsibility Segregation"
  - Greg Young, 2010

```
UI -> API -> Datenbank


     API (Commands) - Datenbank (Integrität, Konsistenz) … SQL
   /                      |
UI                        | Zeitlicher Versatz (Synchronisation)
   \                      v
     API (Queries) -- Datenbank (Denormalisiert, Effizienz) … NoSQL
```

- Normalformen in Datenbanken
  - 5 NF: Schreiben toll, lesen ineffizient
  - 1 NF: Lesen toll, schreiben ineffizient

```
     C
   /   \
 A ----- P

C = Consistency
A = Availability
P = Partition Tolerance

Such Dir zwei Ecken aus!

CP = Konsistent, selbst bei Netzwerkausfall (aber nicht verfügbar für Schreiben)
AP = Verfügbar, selbst bei Netzwerkausfall (aber nicht sofort konsistent)
CA = Konsistent + verfügbar (unrealistisch, da Netzwerke instabil sind)
```

- Was passiert bei "Eventual Consistency" im dümmsten Fall?
  - Das ist keine technische Frage, das ist eine fachliche Frage


## DDD + ES + CQRS im Verbund

```
                              +---------- State ------------+
                              |                             | Replay
                              v                             |
       API (Command) -----> Domain -----> Evt --------> Event-Store
     /                                     |
  Cmds                             +-------+
   /                               |       |
UI <-- API (Event) ----------------+   Projektion
   \                                       |
  Queries                                  |
     \                                     v
       API (Query) ---------------> View-Datenbank
```

- GraphQL
  - Query
  - Mutation
  - Subscription
