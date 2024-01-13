# https://gist.github.com/izikeros/17d9c8ab644bd2762acf6b19dd0cea39
import tiktoken


def split_string_with_limit(text: str, limit: int, encoding: tiktoken.Encoding):
    """Split a string into parts of given size without breaking words.

    Args:
        text (str): Text to split.
        limit (int): Maximum number of tokens per part.
        encoding (tiktoken.Encoding): Encoding to use for tokenization.

    Returns:
        list[str]: List of text parts.

    """
    tokens = encoding.encode(text)
    parts = []
    current_part = []
    current_count = 0

    for token in tokens:
        current_part.append(token)
        current_count += 1

        if current_count >= limit:
            parts.append(current_part)
            current_part = []
            current_count = 0

    if current_part:
        parts.append(current_part)

    text_parts = [encoding.decode(part) for part in parts]

    return text_parts


if __name__ == "__main__":
    # Example usage
    encoding = tiktoken.get_encoding("cl100k_base")
    text = "This is a sample sentence for testing the string splitting function."
    limit = 5
    texts = split_string_with_limit(text, limit, encoding)
    print(texts)