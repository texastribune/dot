# Dot: Pixel Tracker

## Usage
### Requirements
* Docker
### Running Locally
```sh
# builds dot image & runs app container in your terminal
make dev

# run from a separate terminal to ping the dot container
make ping
```

## How it Works
```mermaid
sequenceDiagram
    browser->>dot: pixel.gif?a=1&b=2
    Note over dot: Record View<br>store['a=1&b=2'] += 1
    dot->>browser: pixel.gif
    loop Every x seconds
        Note over dot: Clear Store<br>data, store = store, Counter()
        dot->>endpoint: POST data
        alt
            endpoint->>dot: error
            Note over dot: Merge Store<br>store += data
        end
    end
```
