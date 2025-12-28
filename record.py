import argparse
import sys
from config.loader import ConfigLoader
from tools.live_recorder import LiveRecorder

def main():
    parser = argparse.ArgumentParser(description="SignLens Dataset Recorder")
    parser.add_argument('--gui', action='store_true', help="Launch GUI Configurator")
    parser.add_argument('--cli', action='store_true', help="Launch CLI Configurator")
    args = parser.parse_args()

    # Load Config
    config = ConfigLoader.load_config()
    
    # Determine Interface
    use_gui = False
    if args.gui:
        use_gui = True
    elif args.cli:
        use_gui = False
    else:
        # Check config
        if config.get('dataset', {}).get('interface') == 'gui':
            use_gui = True

    # Launch Menu
    recorder_config = None
    if use_gui:
        try:
            from tools.gui import RecorderGUI
            print("Launching GUI...")
            gui = RecorderGUI(config)
            recorder_config = gui.run()
        except ImportError as e:
            print(f"Failed to load GUI: {e}. Falling back to CLI.")
            use_gui = False

    if not use_gui:
        from tools.menu import RecorderMenu
        menu = RecorderMenu(config)
        recorder_config = menu.show_main_menu()

    if not recorder_config:
        print("No configuration selected. Exiting.")
        return

    # Start Recorder based on source selection
    print(f"Starting Recorder with config: {recorder_config}")
    
    recorder_source = recorder_config.get('recorder_source', 'live')
    
    if recorder_source == "video":
        from tools.video_recorder import VideoRecorder
        recorder = VideoRecorder(config, recorder_config)
    else:
        recorder = LiveRecorder(config, recorder_config)
    
    recorder.run()

if __name__ == "__main__":
    main()
