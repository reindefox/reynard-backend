# shellcheck disable=SC2164
parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd - P)

# shellcheck disable=SC2164
cd "$parent_path"
rm -rf ../../dist/*
echo "- Dist directory has been cleaned"
