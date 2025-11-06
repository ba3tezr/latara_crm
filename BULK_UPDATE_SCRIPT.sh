#!/bin/bash

# ====================================================================
# Bulk Update Script - تحديث جماعي لملفات Templates
# ====================================================================
# يقوم بتحديث extends من base.html إلى base_new.html
# مع إنشاء نسخ احتياطية تلقائية
# ====================================================================

# ألوان للمخرجات
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# عداد
TOTAL=0
SUCCESS=0
FAILED=0

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  تحديث جماعي لقوالب التصميم الجديد   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# البحث عن جميع الملفات التي تستخدم base.html
echo -e "${YELLOW}🔍 البحث عن الملفات...${NC}"
FILES=$(find . -name "*.html" -path "*/templates/*" -type f -exec grep -l "{% extends 'base.html' %}" {} \; 2>/dev/null | grep -v ".backup" | grep -v "base.html$" | grep -v "base_new.html" | grep -v "base_auth.html")

# عد الملفات
TOTAL=$(echo "$FILES" | wc -l)

echo -e "${BLUE}📊 تم العثور على ${TOTAL} ملف${NC}"
echo ""

# استثناءات - صفحات لا يجب تحديثها
EXCEPTIONS=(
    "base.html"
    "base_new.html"
    "base_auth.html"
    "base_backup"
    ".backup"
)

# معالجة كل ملف
while IFS= read -r file; do
    # التحقق من أن الملف ليس ضمن الاستثناءات
    SKIP=false
    for exc in "${EXCEPTIONS[@]}"; do
        if [[ "$file" == *"$exc"* ]]; then
            SKIP=true
            break
        fi
    done
    
    if [ "$SKIP" = true ]; then
        continue
    fi
    
    # إنشاء نسخة احتياطية
    if [ ! -f "${file}.backup" ]; then
        cp "$file" "${file}.backup" 2>/dev/null
    fi
    
    # تحديث الملف
    sed -i "1s/{% extends 'base.html' %}/{% extends 'base_new.html' %}/" "$file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        SUCCESS=$((SUCCESS + 1))
        echo -e "${GREEN}✓${NC} $file"
    else
        FAILED=$((FAILED + 1))
        echo -e "${RED}✗${NC} $file"
    fi
    
done <<< "$FILES"

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           ملخص التحديث                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo -e "${GREEN}✅ نجح: ${SUCCESS}${NC}"
echo -e "${RED}❌ فشل: ${FAILED}${NC}"
echo -e "${BLUE}📊 الإجمالي: ${TOTAL}${NC}"
echo ""

# حساب النسبة
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((SUCCESS * 100 / TOTAL))
    echo -e "${YELLOW}📈 نسبة الإنجاز: ${PERCENTAGE}%${NC}"
fi

echo ""
echo -e "${GREEN}✅ تم الانتهاء!${NC}"
echo -e "${BLUE}💾 جميع الملفات لها نسخ احتياطية (.backup)${NC}"
echo ""
