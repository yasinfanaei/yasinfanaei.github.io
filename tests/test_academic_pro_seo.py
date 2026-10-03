from pathlib import Path
import json
import unittest
import yaml

ROOT=Path(__file__).resolve().parents[1]
JS=(ROOT/'assets/site.js').read_text(encoding='utf-8')
CSS=(ROOT/'assets/style.css').read_text(encoding='utf-8')
PRIMARY='https://yasinfanaei.github.io/yasinfanaeishahroudi'

class AcademicProSeoTests(unittest.TestCase):
    def test_static_seo_files_and_bilingual_404_exist(self):
        self.assertTrue((ROOT/'robots.txt').exists())
        self.assertTrue((ROOT/'sitemap.xml').exists())
        nf=(ROOT/'404.html').read_text(encoding='utf-8')
        self.assertIn('Page not found',nf)
        self.assertIn('صفحه پیدا نشد',nf)

    def test_root_homepages_point_to_project_site_and_are_noindex(self):
        en=(ROOT/'index.html').read_text(encoding='utf-8')
        fa=(ROOT/'fa/index.html').read_text(encoding='utf-8')
        self.assertIn('meta name="robots" content="noindex,follow"',en)
        self.assertIn(f'rel="canonical" href="{PRIMARY}/"',en)
        self.assertIn(f'hreflang="en" href="{PRIMARY}/"',en)
        self.assertIn(f'hreflang="fa" href="{PRIMARY}/fa/"',en)
        self.assertIn('meta name="robots" content="noindex,follow"',fa)
        self.assertIn(f'rel="canonical" href="{PRIMARY}/fa/"',fa)
        self.assertIn(f'hreflang="en" href="{PRIMARY}/"',fa)
        self.assertIn(f'hreflang="fa" href="{PRIMARY}/fa/"',fa)

    def test_root_dynamic_metadata_also_points_to_project_and_noindexes(self):
        design=json.loads((ROOT/'content/settings/design.json').read_text(encoding='utf-8'))
        self.assertEqual(design['seo']['site_url'],PRIMARY)
        self.assertFalse(design['seo']['indexing_enabled'])
        self.assertIn('function canonicalUrl',JS)
        self.assertIn('indexing_enabled',JS)
        self.assertIn('noindex,nofollow',JS)

    def test_google_search_console_verification_tag_stays_on_root_homepage(self):
        en=(ROOT/'index.html').read_text(encoding='utf-8')
        self.assertIn('<meta name="google-site-verification" content="WaiorulwqNLqZ582mRY0-LFz59F2rAhdh12W2OpY1uM"', en)

    def test_analytics_remains_opt_in_and_disabled(self):
        design=json.loads((ROOT/'content/settings/design.json').read_text(encoding='utf-8'))
        self.assertFalse(design['analytics']['enabled'])
        self.assertIn('function initAnalytics',JS)

    def test_shared_seo_settings_are_cms_managed(self):
        cfg=yaml.safe_load((ROOT/'.pages.yml').read_text(encoding='utf-8'))
        entry=next(e for e in cfg['content'] if e.get('name')=='design_branding')
        names={f['name'] for f in entry['fields']}
        self.assertIn('seo',names)

    def test_accessibility_and_performance_hooks_are_present(self):
        self.assertIn(':focus-visible',CSS)
        self.assertIn('@media (prefers-reduced-motion: reduce)',CSS)
        self.assertIn('decoding="async"',JS)
        self.assertIn('fetchpriority="high"',JS)

if __name__=='__main__':unittest.main()
