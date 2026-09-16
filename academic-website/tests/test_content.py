from pathlib import Path
import json
import re
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_CONTENT = {
    "profile.json",
    "education.json",
    "research.json",
    "publications.json",
    "projects.json",
    "experience.json",
    "awards.json",
    "skills.json",
    "site.json",
}


class ContentTests(unittest.TestCase):
    def test_content_files_parse_and_validate(self):
        validator = ROOT / "scripts" / "validate_content.py"
        self.assertTrue(validator.exists(), "scripts/validate_content.py is missing")
        self.assertTrue((ROOT / "content").exists(), "content directory is missing")
        self.assertEqual({p.name for p in (ROOT / "content").glob("*.json")}, REQUIRED_CONTENT)
        sys.path.insert(0, str(ROOT / "scripts"))
        from validate_content import validate_site
        self.assertEqual(validate_site(ROOT), [])

    def test_no_sensitive_identity_keys_or_long_id_numbers(self):
        content_dir = ROOT / "content"
        self.assertTrue(content_dir.exists(), "content directory is missing")
        banned_keys = {
            "national_id", "nationalId", "marital_status", "maritalStatus",
            "date_of_birth", "dateOfBirth", "phone", "private_phone"
        }
        for path in content_dir.glob("*.json"):
            data = json.loads(path.read_text(encoding="utf-8"))
            text = json.dumps(data, ensure_ascii=False)
            self.assertFalse(any(f'"{key}"' in text for key in banned_keys), path.name)
            self.assertIsNone(re.search(r"(?<!\d)\d{10,12}(?!\d)", text), path.name)


if __name__ == "__main__":
    unittest.main()
