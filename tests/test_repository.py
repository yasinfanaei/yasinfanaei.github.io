from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]


class RepositoryTests(unittest.TestCase):
    def test_repository_is_release_ready(self):
        checker = ROOT / "scripts" / "check_site.py"
        self.assertTrue(checker.exists(), "scripts/check_site.py is missing")
        sys.path.insert(0, str(ROOT / "scripts"))
        from check_site import check_site
        self.assertEqual(check_site(ROOT), [])

    def test_readme_documents_github_pages_and_pages_cms(self):
        text = (ROOT / "README.md").read_text(encoding="utf-8")
        self.assertIn("GitHub Pages", text)
        self.assertIn("Pages CMS", text)
        self.assertIn("main", text)
        self.assertIn("/ (root)", text)

    def test_public_cv_docx_has_sensitive_number_scanner(self):
        import importlib
        sys.path.insert(0, str(ROOT / "scripts"))
        module = importlib.import_module("check_site")
        self.assertTrue(hasattr(module, "scan_docx_for_sensitive_numbers"), "DOCX privacy scanner is missing")
        scan = module.scan_docx_for_sensitive_numbers
        self.assertEqual(scan(ROOT / "assets" / "uploads" / "Yasin_Fanaei_Shahroudi_CV.docx"), [])


if __name__ == "__main__":
    unittest.main()
