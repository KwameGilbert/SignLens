import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import os

class RecorderGUI:
    def __init__(self, config):
        self.config = config
        self.dataset_config = config.get('dataset', {})
        self.result = None
        self.root = tk.Tk()
        self.root.title("SignLens Recorder Config")
        self.root.geometry("500x600")
        
        self.setup_ui()
        
    def setup_ui(self):
        # Styles
        style = ttk.Style()
        style.configure("TLabel", font=("Helvetica", 11))
        style.configure("TButton", font=("Helvetica", 11))
        style.configure("Header.TLabel", font=("Helvetica", 14, "bold"))

        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Header
        ttk.Label(main_frame, text="Dataset Recorder Setup", style="Header.TLabel").pack(pady=(0, 20))

        # 1. Mode Selection
        mode_frame = ttk.LabelFrame(main_frame, text="1. Recording Mode", padding="10")
        mode_frame.pack(fill=tk.X, pady=5)
        
        self.mode_var = tk.StringVar(value="keyboard")
        ttk.Radiobutton(mode_frame, text="Keyboard (Manual)", variable=self.mode_var, value="keyboard").pack(anchor=tk.W)
        ttk.Radiobutton(mode_frame, text="Automatic Timer", variable=self.mode_var, value="auto").pack(anchor=tk.W)
        ttk.Radiobutton(mode_frame, text="Hybrid", variable=self.mode_var, value="hybrid").pack(anchor=tk.W)

        # 2. Class Source
        class_frame = ttk.LabelFrame(main_frame, text="2. Class Source", padding="10")
        class_frame.pack(fill=tk.X, pady=5)
        
        self.source_var = tk.StringVar(value="predefined")
        
        def toggle_class_inputs():
            val = self.source_var.get()
            self.manual_entry.config(state="normal" if val == "manual" else "disabled")
            self.file_btn.config(state="normal" if val == "file" else "disabled")

        ttk.Radiobutton(class_frame, text="Predefined List (Config)", variable=self.source_var, value="predefined", command=toggle_class_inputs).pack(anchor=tk.W)
        
        manual_frame = ttk.Frame(class_frame)
        manual_frame.pack(fill=tk.X, anchor=tk.W)
        ttk.Radiobutton(manual_frame, text="Manual Input:", variable=self.source_var, value="manual", command=toggle_class_inputs).pack(side=tk.LEFT)
        self.manual_entry = ttk.Entry(manual_frame, state="disabled")
        self.manual_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)

        file_frame = ttk.Frame(class_frame)
        file_frame.pack(fill=tk.X, anchor=tk.W)
        ttk.Radiobutton(file_frame, text="Load from File:", variable=self.source_var, value="file", command=toggle_class_inputs).pack(side=tk.LEFT)
        self.file_btn = ttk.Button(file_frame, text="Browse...", state="disabled", command=self.browse_file)
        self.file_btn.pack(side=tk.LEFT, padx=5)
        self.file_path_lbl = ttk.Label(file_frame, text="")
        self.file_path_lbl.pack(side=tk.LEFT)

        # 3. Gesture Type
        type_frame = ttk.LabelFrame(main_frame, text="3. Gesture Type", padding="10")
        type_frame.pack(fill=tk.X, pady=5)
        
        self.type_var = tk.StringVar(value="dynamic")
        ttk.Radiobutton(type_frame, text="Static (Alphabet)", variable=self.type_var, value="static").pack(anchor=tk.W)
        ttk.Radiobutton(type_frame, text="Dynamic (Words)", variable=self.type_var, value="dynamic").pack(anchor=tk.W)

        # 4. Sequence Length
        len_frame = ttk.LabelFrame(main_frame, text="4. Sequence Length", padding="10")
        len_frame.pack(fill=tk.X, pady=5)
        
        self.len_var = tk.StringVar(value="default")
        
        def toggle_len_input():
            self.custom_len_entry.config(state="normal" if self.len_var.get() == "custom" else "disabled")

        ttk.Radiobutton(len_frame, text="Default (from Config)", variable=self.len_var, value="default", command=toggle_len_input).pack(anchor=tk.W)
        
        custom_len_frame = ttk.Frame(len_frame)
        custom_len_frame.pack(fill=tk.X, anchor=tk.W)
        ttk.Radiobutton(custom_len_frame, text="Custom:", variable=self.len_var, value="custom", command=toggle_len_input).pack(side=tk.LEFT)
        self.custom_len_entry = ttk.Entry(custom_len_frame, width=10, state="disabled")
        self.custom_len_entry.pack(side=tk.LEFT, padx=5)

        # Start Button
        ttk.Button(main_frame, text="Start Recording", command=self.on_start).pack(pady=20, fill=tk.X)

    def browse_file(self):
        filename = filedialog.askopenfilename(filetypes=[("Text Files", "*.txt")])
        if filename:
            self.file_path_lbl.config(text=os.path.basename(filename))
            self.selected_file = filename

    def on_start(self):
        # Validation and Config Building
        classes = []
        source = self.source_var.get()
        
        if source == "predefined":
            classes = self.dataset_config.get('classes', [])
        elif source == "manual":
            val = self.manual_entry.get().strip()
            if not val:
                messagebox.showerror("Error", "Please enter a class name.")
                return
            classes = [val]
        elif source == "file":
            if not hasattr(self, 'selected_file'):
                messagebox.showerror("Error", "Please select a file.")
                return
            try:
                with open(self.selected_file, 'r') as f:
                    classes = [line.strip() for line in f.readlines() if line.strip()]
            except Exception as e:
                messagebox.showerror("Error", f"Failed to read file: {e}")
                return

        gesture_type = self.type_var.get()
        
        seq_len = 0
        if self.len_var.get() == "default":
            seq_len = self.dataset_config['sequence_lengths'][f'{gesture_type}_default']
        else:
            try:
                seq_len = int(self.custom_len_entry.get())
            except ValueError:
                messagebox.showerror("Error", "Invalid sequence length.")
                return

        self.result = {
            "mode": self.mode_var.get(),
            "classes": classes,
            "gesture_type": gesture_type,
            "sequence_length": seq_len,
            "output_dir": self.dataset_config.get('output_dir', 'dataset')
        }
        self.root.destroy()

    def run(self):
        self.root.mainloop()
        return self.result

if __name__ == "__main__":
    from config.loader import ConfigLoader
    conf = ConfigLoader.load_config()
    gui = RecorderGUI(conf)
    print(gui.run())
