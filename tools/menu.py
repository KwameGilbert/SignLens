from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, IntPrompt
from rich import print
import os

console = Console()

class RecorderMenu:
    def __init__(self, config):
        self.config = config
        self.dataset_config = config.get('dataset', {})

    def show_main_menu(self):
        console.clear()
        console.print(Panel.fit("[bold cyan]SignLens Dataset Recorder[/bold cyan]", border_style="cyan"))
        
        # 1. Recording Mode
        console.print("\n[bold yellow]Step 1: Choose Recording Mode[/bold yellow]")
        console.print("1. [green]Keyboard Control[/green] (Press 'r' to record, 's' to stop/save)")
        console.print("2. [green]Automatic Timer[/green] (Auto-start/stop with countdown)")
        console.print("3. [green]Hybrid Mode[/green] (Timer start + Manual stop)")
        
        mode_choice = IntPrompt.ask("Selection", choices=["1", "2", "3"], default=1)
        modes = {1: "keyboard", 2: "auto", 3: "hybrid"}
        selected_mode = modes[mode_choice]

        # 2. Class Source
        console.print("\n[bold yellow]Step 2: Choose Class Source[/bold yellow]")
        console.print("1. [green]Predefined List[/green] (from config.yaml)")
        console.print("2. [green]Type Manually[/green]")
        console.print("3. [green]Load from File[/green]")
        
        source_choice = IntPrompt.ask("Selection", choices=["1", "2", "3"], default=1)
        
        classes = []
        if source_choice == 1:
            classes = self.dataset_config.get('classes', [])
            console.print(f"[dim]Loaded {len(classes)} classes from config.[/dim]")
        elif source_choice == 2:
            class_name = Prompt.ask("Enter class name")
            classes = [class_name]
        elif source_choice == 3:
            file_path = Prompt.ask("Enter file path", default="classes.txt")
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    classes = [line.strip() for line in f.readlines() if line.strip()]
                console.print(f"[dim]Loaded {len(classes)} classes from file.[/dim]")
            else:
                console.print("[bold red]File not found! Using manual input.[/bold red]")
                class_name = Prompt.ask("Enter class name")
                classes = [class_name]

        # 3. Gesture Type
        console.print("\n[bold yellow]Step 3: Type of Gesture[/bold yellow]")
        console.print("1. [green]Static[/green] (Alphabet/Single-frame)")
        console.print("2. [green]Dynamic[/green] (Words/Actions)")
        
        type_choice = IntPrompt.ask("Selection", choices=["1", "2"], default=2)
        gesture_type = "static" if type_choice == 1 else "dynamic"

        # 4. Sequence Length
        default_len = self.dataset_config['sequence_lengths'][f'{gesture_type}_default']
        console.print(f"\n[bold yellow]Step 4: Sequence Length[/bold yellow] (Default: {default_len})")
        console.print("1. [green]Use Default[/green]")
        console.print("2. [green]Enter Custom[/green]")
        
        len_choice = IntPrompt.ask("Selection", choices=["1", "2"], default=1)
        
        if len_choice == 2:
            seq_len = IntPrompt.ask("Enter sequence length", default=default_len)
        else:
            seq_len = default_len

        # Summary
        console.print("\n[bold green]Configuration Ready![/bold green]")
        console.print(f"Mode: [cyan]{selected_mode}[/cyan]")
        console.print(f"Classes: [cyan]{classes}[/cyan]")
        console.print(f"Type: [cyan]{gesture_type}[/cyan]")
        console.print(f"Length: [cyan]{seq_len}[/cyan]")
        
        return {
            "mode": selected_mode,
            "classes": classes,
            "gesture_type": gesture_type,
            "sequence_length": seq_len,
            "output_dir": self.dataset_config.get('output_dir', 'dataset')
        }

if __name__ == "__main__":
    # Test run
    from config.loader import ConfigLoader
    conf = ConfigLoader.load_config()
    menu = RecorderMenu(conf)
    print(menu.show_main_menu())
