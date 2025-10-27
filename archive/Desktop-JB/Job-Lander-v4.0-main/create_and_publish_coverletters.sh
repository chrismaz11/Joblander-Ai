#!/usr/bin/env bash
set -euo pipefail

# CONFIG - edit if needed
TEMPLATES_DIR="./templates"
S3_BUCKET="joblander-v4-production"
CLOUDFRONT_DIST_ID="E2JTNKZQEEGBZ5"
COUNT=27

mkdir -p "$TEMPLATES_DIR"

# small function to generate a cover letter template
generate_cover() {
  local idx=$1
  local cat=$2
  local file="$TEMPLATES_DIR/cover_${cat}_${idx}.html"
  cat > "$file" <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Cover Letter - {{position}} - {{name}}</title>
<style>
  body{font-family: Arial,Helvetica,sans-serif; color:#111; padding:20px;}
  .cover{max-width:800px;margin:0 auto;}
  header{margin-bottom:14px;}
  h1{font-size:20px;margin:0 0 6px 0;color:#222;}
  .contact{font-size:13px;color:#666;margin-bottom:12px;}
  p{margin:10px 0;}
  .signature{margin-top:18px;}
  @media print{ .no-print{display:none;} }
</style>
</head>
<body>
<div class="cover">
  <header>
    <div class="contact">{{name}} | {{email}} | {{phone}} | {{location}}</div>
    <div><strong>{{date}}</strong></div>
  </header>

  <p>Hiring Manager<br/>{{company}}<br/>{{company_address}}</p>

  <p>Dear {{hiring_manager|Hiring Manager}},</p>

  <p>I am writing to express my interest in the <strong>{{position}}</strong> role at {{company}}. With {{years}} years of experience in {{industry}}, I bring a proven record of delivering measurable results, including {{achievement_1}} and {{achievement_2}}.</p>

  <p>My background includes: <strong>{{key_skill_1}}</strong>, <strong>{{key_skill_2}}</strong>, and a track record of success with {{relevant_tech_or_method}}. I am confident these skills make me a strong fit for the needs described in your job posting.</p>

  <p>I have attached my resume and relevant publications (verifiable via the credential link below). I would welcome the opportunity to discuss how my background aligns with your team’s goals.</p>

  <p class="signature">Sincerely,<br/><strong>{{name}}</strong><br/>{{linkedin}} • {{portfolio}}</p>

  <section class="small">
    <p><em>Credential verification:</em> <a href="{{blockchain_proof_url}}">Verify publications & certificates</a></p>
  </section>
</div>
</body>
</html>
HTML
  echo "Wrote $file"
}

# categories tailored to match resume categories in your project
declare -a cats=("medical" "tech" "education" "art" "finance" "legal" "general")
# make distribution: 4,4,4,4,3,3,5 -> total 27 (same as resume set)
counts=(4 4 4 4 3 3 5)

i=1
for idx in "${!cats[@]}"; do
  catname=${cats[$idx]}
  ccount=${counts[$idx]}
  for n in $(seq 1 $ccount); do
    generate_cover "$n" "$catname"
    i=$((i+1))
  done
done

echo "All cover-letter templates created in $TEMPLATES_DIR (cover_<cat>_<n>.html)"

# Sync to S3
echo "Syncing templates to s3://$S3_BUCKET/templates/"
aws s3 sync "$TEMPLATES_DIR" "s3://$S3_BUCKET/templates/" --acl public-read
echo "Sync complete."

# CloudFront invalidation for templates
if [ -n "$CLOUDFRONT_DIST_ID" ]; then
  echo "Creating CloudFront invalidation for /templates/*"
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DIST_ID" --paths "/templates/*" >/dev/null
  echo "Invalidation requested."
fi

echo "Done. Cover letters are published to s3://$S3_BUCKET/templates/"
