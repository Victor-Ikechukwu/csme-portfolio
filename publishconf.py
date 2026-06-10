from pathlib import Path
import runpy


_BASE_SETTINGS = runpy.run_path(str(Path(__file__).with_name("pelicanconf.py")))
globals().update(
    {
        key: value
        for key, value in _BASE_SETTINGS.items()
        if not key.startswith("__")
    }
)

RELATIVE_URLS = True
