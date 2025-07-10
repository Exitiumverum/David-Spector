require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function uploadAboutContent() {
  console.log('=== UPLOADING ABOUT CONTENT TO DATABASE ===');
  
  try {
    // About page content sections
    const aboutContent = [
      {
        key: 'about_title',
        hebrew: 'נעים להכיר!',
        english: 'Nice to meet you!',
        section: 'about'
      },
      {
        key: 'about_intro',
        hebrew: 'אני מאמין שהמרחב שסביבנו משפיע על איך שאנחנו מרגישים, חושבים, ואפילו על מערכות היחסים שלנו. לפעמים קשה לשים את האצבע על מה הופך חלל ל"נעים" או "קודר" – אבל כולנו מרגישים את זה מיד.',
        english: 'I believe that the space around us affects how we feel, think, and even our relationships. Sometimes it\'s hard to put your finger on what makes a space "pleasant" or "gloomy" – but we all feel it immediately.',
        section: 'about'
      },
      {
        key: 'about_mission',
        hebrew: 'דרך עיצוב, תכנון והדמיה, אני עוזר לאנשים לראות את הפוטנציאל האמיתי של נכסים – בין אם הם גרים בהם, משכירים אותם או רוצים לקנות נכס.',
        english: 'Through design, planning and visualization, I help people see the real potential of properties – whether they live in them, rent them or want to buy a property.',
        section: 'about'
      },
      {
        key: 'about_impact',
        hebrew: 'שינוי קטן יכול לעשות הבדל ענק – בדיוק בשביל זה אני כאן.',
        english: 'A small change can make a huge difference – that\'s exactly why I\'m here.',
        section: 'about'
      },
      {
        key: 'about_experience',
        hebrew: 'צברתי ניסיון עשיר בתכנון, עיצוב וניהול פרויקטים – מדירות ובתים פרטיים ועד שכונות של מאות יחידות דיור במשרד פיבקו אדריכלים ועוד. כיום אני משלב את תחומי ההתמחות שלי – אדריכלות, עיצוב פנים ותיווך נדל"ן ברימקס אושן תל אביב – כדי להעניק לכם פתרון שלם, מקצועי ומדויק.',
        english: 'I have accumulated rich experience in planning, design and project management – from apartments and private homes to neighborhoods of hundreds of housing units at Pivko Architects and more. Today I combine my areas of expertise – architecture, interior design and real estate brokerage at Remax Ocean Tel Aviv – to provide you with a complete, professional and accurate solution.',
        section: 'about'
      },
      {
        key: 'about_vision',
        hebrew: 'בזכות ההבנה הרחבה שלי במרחב, בערך שעיצוב טוב נותן ובשוק הנדל"ן, אני רואה את הנכס שלכם לא רק כמו שהוא – אלא כמו שהוא יכול להיות.',
        english: 'Thanks to my broad understanding of space, the value that good design provides and the real estate market, I see your property not just as it is – but as it can be.',
        section: 'about'
      }
    ];
    
    console.log(`Uploading ${aboutContent.length} content sections...`);
    
    for (const content of aboutContent) {
      console.log(`Uploading: ${content.key}`);
      
      // Check if content already exists
      const { data: existing } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', content.key)
        .single();
      
      if (existing) {
        // Update existing content
        const { error: updateError } = await supabase
          .from('site_content')
          .update({
            hebrew: content.hebrew,
            english: content.english,
            section: content.section
          })
          .eq('key', content.key);
        
        if (updateError) {
          console.error(`Error updating ${content.key}:`, updateError);
        } else {
          console.log(`✅ Updated: ${content.key}`);
        }
      } else {
        // Insert new content
        const { error: insertError } = await supabase
          .from('site_content')
          .insert([content]);
        
        if (insertError) {
          console.error(`Error inserting ${content.key}:`, insertError);
        } else {
          console.log(`✅ Inserted: ${content.key}`);
        }
      }
    }
    
    console.log('\n=== ABOUT CONTENT UPLOAD COMPLETED ===');
    
  } catch (error) {
    console.error('Error in upload process:', error);
  }
}

// Run the upload
uploadAboutContent().catch(console.error); 