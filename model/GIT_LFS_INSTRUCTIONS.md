# Using Git LFS in This Project

This project uses Git LFS (Large File Storage) to handle large files such as images and model weights. If you are collaborating on this repository, please follow these steps to ensure you can work with large files correctly.

## 1. Install Git LFS
Install Git LFS on your machine (only needed once):

```
git lfs install
```

## 2. Clone or Pull the Repository
Clone the repository as usual:

```
git clone <repo-url>
```

Or, if you already have the repo:

```
git pull
```

Git LFS will automatically download the large files referenced in the repo.

## 3. Adding and Committing Large Files
To add new large files (e.g., images, .h5 models), track them with Git LFS:

```
git lfs track "*.png" "*.jpg" "*.h5"
git add .gitattributes
```

Then add and commit your large files as usual:

```
git add <large files> or git add .
git commit -m "Add large files with LFS"
git push
```

## Note
If you do not install Git LFS, you will only get small pointer files instead of the actual large files.

For more info, see: https://git-lfs.github.com/
