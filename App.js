import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, ScrollView, TextInput,
  StyleSheet, Alert, Modal, Linking, StatusBar, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://yzxslmfvohpajajllqen.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YCtGMhOg5QeovR8pz6YBSw_skrOHlAh';

const LOGO_BASE64 = 'data:image/png;base64,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XHjh3EEtjXrGnXDC0Uqlv/7ydd0BeOEFZxP19LUvzvYs17997UukvTGTXnPKKb8Av/2y4pVXXiaiop2VypHKFcJ1PcfzbCFtbWg9+RS5SrlK6XnpRq2sDe0ocpRySLml/6Acpeyo9aVyQutLZXvCH89CMUNEy5YtHTt2rL6z3XYf89VXC4k6+joWpzuXZHtXpTuXEXVe8OuzAODIIw8lKhCl5559CmNs9OhR2d4fMt0rPHfrAQdMAYA//vGCP/7xfACYd9lviLb2dSxLdy4j6rng1+cwxNbWQYbBTz55Fqn+5Yve+eDt59rbfzzssIMR8Y9/OI9I2IUNRL233PwXALAs/5CxmprqCRPGA0BVVeVPP35G1PurX52GiIyzj99/XhTX9XctzXQv6+9aRtS16Lv399prd/3B4cOHf/nl59rKQtp6kupn148vlRO87iollHLDifv/w9DKVspR5BAJ7Un0NI/OayGL+gs8USwU+4mop6fr6KNn6vtLJhN33nkjya1Obm1v+9J05zLpti189REAqK+vfeyxu3t6Nl944VzO+YgRw3o6lhL13X7bDQDQ3NyYTq+//PLfAMBppx5PaktfxzK7/6fujpVNTY2JROIft14NAHV1te1t36niei+3nihzwa/PBoCDDpzi5td3dyz3ChuWf/9ePB5jjE2YMO6BB+7YvGnpxvXfa07h7bddT5T+adVnpmUOGzr4nTefdApru7cscnJriDrvu+9flfpIVYBDDjlky5bNoZVDs3qi6Lh5x80L4ZteKUcpTymhlIgY2pbKCR0vRKwemFL6M5dIkpJKCeUbumRr/a1KufoPx83rU+Suvvov4f55zDEzfvjhM6L2TPeK3q2Lldd20w2X6/+USCT1H7/77blE6RUrPq2trbUsc/bs43p7u2688QoAmHbQfspp69m6hGTHE4/dCwDjx+3R3bmkubkBAJ5+8l7pbe5s+17Kjn/8/WoAGDVqh0z3qnzfj/1dy4W94aCD9kPEU0/5BVEx3bNSifaZMw/jnI8fv2cht17k1r/56hOb1n0jiuv7O5cRda5Z8/Xxx88MvdPFF18spUckbCenraznVmhlx817ouib0p/OQimplBfO6MDQriI3NLRL5EUNLZWjyJPSjb47aujSi0ooEkLajpsnotcXvr7DDjvo262trb7hxnn57Brytva1L1POxi8+efncX84ZOXL4yB2H//aiX/V3/0Cqe8aMQ8InNE1z2LAhALDTTiPz6R8zXcuVaD/m6BmI+Le/XUFEZ55xAiKePmc2UWf3liXkbXp1wSO6l33Nqk+d7Jre9iWktv779usBIJVK/rjq01xmDYn2x+ffCQAjR45Y/9PXxfRPIr+u0LuanE1uccO//nVtY6O/zQwdNvSll14kIu0iPFHUIYD+2/UKoaGF1EvfDW1NvqFLE3e7htYzV7sRR5EjlSNEUUpn211RyGI4PER6yXieKOYLaSLq7Ow466wzS60x+4x75eUnSXSKwgYn8xPZG7Pdq9KdK8neRHLz32+ep3eq66657I9/+PUuu4zWm1tdXe2m9d9IZ8OqZZ8kknGGuN9++86ZM2fixPGIWN9Qt2XDokLfD15+7ZLv3jEMAwA+ev9FZW/o7VjqZH5a+8OntbXVAHDLzVcTdeZ6fmzf+P3j8+/q3Lykv3tFunOZsttIdLz+2lP77jshvNWTTz65vX0rEdl2NpzCoX21a/ans1cI52zoPUiJSLBR8tekAkMHsZ2nAzsd2wlZlKIYGZ8yN11y+cpTSioSgcvOKHKJ6OWXF+y2267hMxw+Y9obC5/yChtFYUOmc2Vf+/LuLUvt7Jqbbpg3ZvSomUdNJ+ombxOprU8/cQ/nPB6PL/nuXaL+v113WUn7IvIz/+E7SGzO9a5sb1vUMqiZcz7/oTtIbu7rWNLXsYzUlqOPPgwAzpl7inQ2pTtW5nt/JLutmF5N3iblbn7n7eeOOGJ6eLWRI0c+9dSTRETk2U5WBxJ67Ya7X/CrnYYd8bfaU0c9hjMgkIPISzLc9EKDDhiZiLn9X3/PlZ6Ovv2IRxSLdpaIcvnM9df/Tbfz659DDz3whecfyfWvJ9lh96/pbV8ii+t7O5Z2bfk+27uqe8tiWVi36Ks39JvfeO0J6XXutPMoAPjVL09ftfLrLz99ffHiD6ZM2YcxdsKsmaQ293UsLWZ+Gj16FAD85sK5RO297Usy3Svs3NpvPn/13beezvb+kO5Ylu5c7mbXkGzPZ9a/8NyDhx56YIgQ1NTUXHHFvN6+HiIq2hntIrShhbQ9YQf2LUZeL5uzoafexso6lBCKPH71X6/yGz3K4cUwVdKnwmF5kjhAKT3CBPBzJM658BzLNA88cNrJJ5+opFy5apXjOGvXbnj6mZdee+PdbDbb2to6eEgrKcmAITDhCW4wIWRFRXL0mJ2rqir22Xv3XCb7n/8+ahjGzddfNn6fPeoqE0OG79S5dfM77328YeOmk2bNrK2uNk3jpzUbWltbjjri4J1HjZBCImPC9Vpbm0ftMIwhJmuq44nE+g1bHnzoqd//8arb7/iv7rlMpVJzzz774YcfOuGE2Ym46bhFxkJRQtjO+QARUjcGoiVY1m2jcS8e1DZDbgGiIgeC5vRtmG0adGcDKf4Q7T8MNG00GYJA6TPkkAHqXFZYZgKArV79w1133fPkk092ajU4gOqa6oMOnHL8cTP232/y8OGDDcsip2jbthCysiJFQPl80XZcIZTrunW1VZr9yDnP5rI//LhWSTVm51HV1VVSiljcjMViwhO5fN4wDNMwYokYGJZyxcbNnR9/8tlLC954//1P+/r69Fc3NjaedNJJF1xw/tixuwKQ6xUZY4GONobHG4fyRxCt//nUDhaCzuVIZ1RD3ufeEQGScuh/NNYDhv3iEWPLEqym0W3GQIUMRL9VI6x4KCIphWXGAdiWrZueeOLJ+Y88unTp0vCCtbU1e+212wFTJ++774Tdxu7U1FRvWqZG55SUUilSynFcpTSxQ3GDJRJxRLCLriIyDW4YnBscTQuYSW6xs6tn1Q9rPv9i0fsffvbdoiXdXd3hd+2+++5zTp9z2qmnDR48GAAcN88Y45wHQJXaBosPaqcDOTQsnIWBrgZC6bRZHLD6USkHt69EGpZX2DZsHUWaxlnqVtcFWlIQihxhUBVhYf+BEF48FkOM2Xb+o48/fuH5F998863169dHv7WpqWnHHYfvvtvoXcaO2XHkiMGtzXX1NRWpZDKZME2TcdSAqlJKSlJKOY6bzxZ6e/vaNm1eu65t1Q9rlq9Y9dNP6zZv2RotuwwbNvSQQ6afeOKJBx9ykGXGAcD1CvpkAkQc0N0WNTSWfiJldwrqHMCJMAD4/QP1ygs+mgqHqJQTVMcGFIIwgvqz8hmtdF8rYqhMgMGprH7ZAxE5Z7qUhkFLOyjlFyQNw+BxAMhm05988unrry/86KOPV61apVVoy1p/uVFdXVVVVVFVVZVMJizLsEwTGQohHMcrFIqZTC6TyWazWcdxtkUZd9555/322++oo46cOnVqTU0tACjyhCc594kOyudZE6lykabILI6YuexwsvCYeV3wDeWkI90CFCpEoCJnoPooEEWuGjl8MCQjKIqWkIM3auUvKi23cFIwAvJ5e9qrKJJSApBpWgAGAHhuceWqVd9+t+ibr79Zvnz52rXr2tvbPc/7fyF5gmVZLS0tI0YM33XXXSdOnDh+73GjR4+OWQk9s/RImCaPos5KKgLattTJGNOUxEA1mpWh8wQECoEHBzmU15TR75wLVF+IgEJDb9tx5lfdy71PRKZ0u/yNaA0vIK5FO7dK7F5AQFJKKKnLTpzzWHipbLavrW3T2nXr1q/bsGnT5s7Ozv7+/lwu53mu47hEyjTNWCxeUZGqrqkZ1NIyeHDrsGHDdthhxNBhQ6ur6krgvbSFEAwZ44yBoamBKuh9GtBxv42vCN1BWAsNJpm/jnl5qSAiDE7hR/wXUVF4tBkOOBh5G4OWqN3bDIB/B3r8YRsan09jLBXiWSAeoUJ9R1IklQRFnHPDNPVM/3/8IUWulFJKhQicGxhKvxH6CwsoUmaEaBEnat8y3jBGYwkKCpWEyAcIHJeQft/QOMDQUa4xRZklFGneo8hB6eRTZVi0VSQ4Oiy0fjlZQxGGuwUyjLRj66WqBR+C1Ye6P55IRVtofd2UMLwsnbfiHyFHAetB81IioVEY8qoB0mfb5A0DVi9gmfSH744RYRt2pCrRdoK6a1ixMspD6236qsOD67HMvUS+m4WkBv+06ygXNkoQZXqsAlYoaikMimqFEUROYOcGBuMbCXB016eCaOsE+qocfv0t+pW+XEfQtkYD+o1hQANdlPSCMICZVyoIlhExynaqSATh75v+Nf8/BTfBMdaxuoEAAAAASUVORK5CYII=';

const toTitleCase = (str) => str ? str.replace(/\b\w/g, c => c.toUpperCase()) : '';
const CITIES = ['Delhi', 'Gurgaon', 'Noida'];
const CATEGORIES = ['Grocery', 'Medical', 'Transport', 'Other'];
const getCategoryIcon = (cat) => cat === 'Grocery' ? '🛒' : cat === 'Medical' ? '💊' : cat === 'Transport' ? '🚗' : '📋';
const TIME_PREFS = ['Now / Today', 'Tomorrow', 'This Week'];

const getUrgencyStyle = (urgency) => {
  if (urgency === 'High')   return { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', label: '🔴 High' };
  if (urgency === 'Medium') return { bg: '#FEF3C7', border: '#D97706', text: '#92400E', label: '🟡 Medium' };
  return { bg: '#E6F4ED', border: '#1E6F3E', text: '#1E6F3E', label: '🟢 Normal' };
};

const formatDateTime = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let h = d.getHours(), m = d.getMinutes().toString().padStart(2,'0');
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return `${d.getDate().toString().padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}, ${h}:${m} ${ap}`;
  } catch { return ''; }
};

// ── Single-tap safe button ─────────────────────────────────
let _globalBtnLock = false;
function Btn({ style, textStyle, onPress, children, disabled }) {
  const handle = () => {
    if (disabled || _globalBtnLock) return;
    _globalBtnLock = true;
    setTimeout(() => { _globalBtnLock = false; }, 1200);
    const r = onPress();
    if (r && typeof r.then === 'function') r.catch(e => console.log(e));
  };
  return (
    <Pressable
      style={({pressed}) => [style, (disabled || pressed) && {opacity:0.6}]}
      onPress={handle}
      android_disableSound={false}>
      {typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children}
    </Pressable>
  );
}

const C = {
  navy: '#0D1B3E', blue: '#1A3A6E', blueMid: '#2952A3', blueLt: '#E8EEF8',
  gold: '#C9972B', goldLt: '#F5E6C0', goldBr: '#E8B84B',
  white: '#FFFFFF', offWhite: '#F7F9FC', grey: '#8A96A8', greyLt: '#EEF1F6',
  text: '#1A2540', textSub: '#4A5568', red: '#C0392B', green: '#1E6F3E', greenLt: '#E6F4ED',
};

function SectionHeader({ icon, title }) {
  return (
    <View style={S.sectionHeader}>
      <View style={S.sectionHeaderBar} />
      <Text style={S.sectionHeaderText}>{icon} {title}</Text>
    </View>
  );
}

function StatBox({ value, label }) {
  return (
    <View style={S.statBox}>
      <Text style={S.statValue}>{value}</Text>
      <Text style={S.statLabel}>{label}</Text>
    </View>
  );
}

function CitySelector({ selected, onSelect, label }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label && <Text style={S.fieldLabel}>{label}</Text>}
      <View style={S.cityRow}>
        {CITIES.map(c => (
          <TouchableOpacity key={c} style={[S.cityChip, selected === c && S.cityChipOn]} onPress={() => onSelect(c)}>
            <Text style={[S.cityChipText, selected === c && S.cityChipTextOn]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function GenderSelector({ selected, onSelect }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={S.fieldLabel}>Gender</Text>
      <View style={S.genderRow}>
        {['Male', 'Female'].map(g => (
          <TouchableOpacity key={g} style={[S.genderChip, selected === g && S.genderChipOn]} onPress={() => onSelect(g)}>
            <Text style={[S.genderChipText, selected === g && S.genderChipTextOn]}>{g === 'Male' ? '👨 Male' : '👩 Female'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Field({ label, placeholder, value, onChange, keyboard, maxLen }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={S.fieldLabel}>{label}</Text>
      <TextInput placeholder={placeholder} placeholderTextColor={C.grey} value={value} onChangeText={onChange} style={S.textInput} keyboardType={keyboard || 'default'} maxLength={maxLen} />
    </View>
  );
}

// ── RATING MODAL ───────────────────────────────────────────
function RatingModal({ visible, title, description, onSubmit, onSkip, language }) {
  const [selected, setSelected] = useState(0);
  const labels = ['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Very Good', '🌟 Excellent!'];
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={S.overlay}>
        <View style={S.ratingCard}>
          <Text style={S.ratingTitle}>{title}</Text>
          <Text style={S.ratingDesc}>{description}</Text>
          <View style={S.starsRow}>
            {[1,2,3,4,5].map(s => (
              <TouchableOpacity key={s} onPress={() => setSelected(s)}>
                <Text style={[S.star, selected >= s && S.starOn]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selected > 0 && <Text style={S.ratingLabel}>{labels[selected]}</Text>}
          <Btn style={[S.primaryBtn, { opacity: selected === 0 ? 0.45 : 1 }]} textStyle={S.primaryBtnText}
            onPress={() => { if (selected > 0) { onSubmit(selected); setSelected(0); } else Alert.alert('Please select a rating'); }}>
            Submit Rating
          </Btn>
          <TouchableOpacity onPress={() => { setSelected(0); onSkip(); }} style={{ marginTop: 12 }}>
            <Text style={S.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function RatingBanner({ onPress }) {
  return (
    <TouchableOpacity style={S.ratingBanner} onPress={onPress}>
      <Text style={S.ratingBannerTitle}>⭐ Pending Rating!</Text>
      <Text style={S.ratingBannerDesc}>Please rate your recent help experience.</Text>
      <Text style={S.ratingBannerCta}>Rate Now →</Text>
    </TouchableOpacity>
  );
}

function FloatingSOS({ onPress }) {
  return (
    <TouchableOpacity style={S.floatSOS} onPress={onPress}>
      <Text style={S.floatSOSText}>🚨 SOS</Text>
    </TouchableOpacity>
  );
}

// ── SEEKER DETAILS MODAL ───────────────────────────────────
function SeekerDetailsModal({ visible, request, seeker, onAccept, onClose }) {
  if (!request) return null;
  const urg = getUrgencyStyle(request.urgency);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.overlay}>
        <View style={S.detailsCard}>
          <Text style={S.detailsTitle}>Seeker Details</Text>
          <View style={S.detailsSection}>
            <Text style={S.detailsSectionLabel}>📋 Request</Text>
            <View style={S.detailsRow}><Text style={S.detailsKey}>Category</Text><Text style={S.detailsVal}>{getCategoryIcon(request.category)} {request.category}</Text></View>
            <View style={S.detailsRow}>
              <Text style={S.detailsKey}>Urgency</Text>
              <View style={[S.urgBadge, { backgroundColor: urg.bg, borderColor: urg.border }]}>
                <Text style={[S.urgBadgeText, { color: urg.text }]}>{urg.label}</Text>
              </View>
            </View>
            {request.time_preference && <View style={S.detailsRow}><Text style={S.detailsKey}>When</Text><Text style={S.detailsVal}>🕐 {request.time_preference}</Text></View>}
            <View style={S.detailsRow}><Text style={S.detailsKey}>Posted</Text><Text style={S.detailsVal}>{formatDateTime(request.created_at)}</Text></View>
            <View style={S.detailsRow}><Text style={S.detailsKey}>Description</Text><Text style={[S.detailsVal, { flex: 1 }]}>{request.description}</Text></View>
          </View>
          {seeker && (
            <View style={S.detailsSection}>
              <Text style={S.detailsSectionLabel}>👴 Seeker Info</Text>
              <View style={S.detailsRow}><Text style={S.detailsKey}>Name</Text><Text style={S.detailsVal}>{seeker.name}</Text></View>
              <View style={S.detailsRow}><Text style={S.detailsKey}>Age</Text><Text style={S.detailsVal}>{seeker.age}</Text></View>
              <View style={S.detailsRow}><Text style={S.detailsKey}>Gender</Text><Text style={S.detailsVal}>{seeker.gender}</Text></View>
              <View style={S.detailsRow}><Text style={S.detailsKey}>City</Text><Text style={S.detailsVal}>🏙️ {seeker.city}</Text></View>
              <View style={S.detailsRow}><Text style={S.detailsKey}>Area</Text><Text style={S.detailsVal}>🏠 {seeker.area}</Text></View>
            </View>
          )}
          <View style={S.detailsBtnRow}>
            <TouchableOpacity style={S.detailsCloseBtn} onPress={onClose}><Text style={S.detailsCloseTxt}>Close</Text></TouchableOpacity>
            <Btn style={S.detailsAcceptBtn} textStyle={S.detailsAcceptTxt} onPress={onAccept}>Accept Request</Btn>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── INFO SCREEN DATA ───────────────────────────────────────
const SAFETY_SEEKER = [
  {type:'intro', text:'Volunteers are caring community members who offer their time and effort to help you. They are not trained professionals, so please keep that in mind while seeking assistance.'},
  {text:'Always speak to the volunteer on phone before proceeding with any help or meeting.'},
  {text:'Please inform your family or a trusted person before accepting help or meeting a volunteer.'},
  {text:'Before allowing a volunteer inside your home, make sure you feel comfortable and have informed someone you trust.'},
  {text:'Please avoid giving money, gifts, or any kind of payment to volunteers. This platform is free and community-driven.'},
  {text:'Never share your OTP, bank details, passwords, or any sensitive information with anyone.'},
  {text:'If anything feels uncomfortable, politely stop the interaction and inform your family or a trusted person immediately.'},
  {text:'For medical, legal, financial, or emergency situations, always contact the appropriate professionals or authorities.'},
];
const SAFETY_HELPER = [
  {type:'intro', text:'Help seekers may include senior citizens who need extra patience and understanding. Please treat every interaction with care, respect, and kindness.'},
  {text:'Always make initial contact via phone before proceeding with any help or meeting.'},
  {text:'Wherever possible, try to connect with a family member of the help seeker before or during the assistance.'},
  {text:'Please inform your family or a trusted person before going to provide help.'},
  {text:'If a home visit is required, prefer visiting when a family member is present. In unfamiliar situations, avoid going alone.'},
  {text:'Please avoid requesting or accepting money, gifts, or any kind of payment from help seekers.'},
  {text:'Never share your personal address, bank details, OTP, or any sensitive information.'},
  {text:'Do not take responsibility for medical, legal, financial, or emergency situations beyond basic support.'},
  {text:'If any situation feels uncomfortable, politely disengage and inform someone you trust.'},
  {text:'In any emergency, immediately contact your family, trusted contacts, or the appropriate authorities.'},
];
const INTERACT_SEEKER = [
  {type:'intro', text:'A little kindness goes a long way. Here is how to make your interaction smooth and pleasant.'},
  {text:'Be polite, patient, and respectful with the volunteer at all times.'},
  {text:'Clearly explain your need so the volunteer can understand and help you better.'},
  {text:'Respect the volunteer\'s time, effort, and limitations — they are helping out of genuine care.'},
  {text:'Avoid putting pressure or making unreasonable demands.'},
  {text:'If there is any change or cancellation, please inform the volunteer in advance.'},
  {text:'Appreciate the support you receive and maintain a warm, cooperative approach throughout.'},
];
const INTERACT_HELPER = [
  {type:'intro', text:'Your kindness can make a real difference. Here is how to make every interaction meaningful and comfortable.'},
  {text:'Be polite, calm, and respectful in all interactions.'},
  {text:'Speak clearly and patiently — especially with senior citizens, who may need extra time and understanding.'},
  {text:'Listen carefully and allow the help seeker to express their needs without interruption.'},
  {text:'Be honest about what you can and cannot do. Avoid making commitments you may not be able to fulfil.'},
  {text:'If there is any delay or change, inform the help seeker clearly and politely — reliability builds trust.'},
  {text:'Treat every help seeker with dignity, empathy, and kindness, and aim to create a comfortable and supportive experience.'},
];
const RATINGS_SEEKER = [
  {type:'intro', text:'Ratings are a simple way to build trust within our community. After each help, both you and the volunteer rate your experience with each other.'},
  {type:'heading', text:'How Ratings Work'},
  {text:'After each help, you can rate the volunteer based on your experience.'},
  {text:'Volunteers also rate their experience with you.'},
  {text:'All ratings are visible on user profiles, helping everyone identify reliable and respectful members of the community.'},
  {text:'Honest ratings help maintain a safe, fair, and supportive environment for all.'},
  {type:'heading', text:'Ratings You Receive'},
  {text:'Your behaviour and cooperation matter. A positive attitude makes volunteers more willing and eager to help you.'},
  {text:'Getting a good rating builds trust and improves your chances of receiving quicker and more willing support in the future.'},
  {type:'highlight', text:'A little appreciation goes a long way — and so does a kind word.'},
  {type:'heading', text:'Impact of Low Ratings'},
  {text:'Consistently low ratings may reduce the number of volunteers responding to your requests.'},
  {text:'Repeated negative feedback may be reviewed by our team, and access to certain features may be reconsidered.'},
];
const RATINGS_HELPER = [
  {type:'intro', text:'Your ratings are a reflection of the care and effort you put into helping others. After each help, both you and the help seeker rate your experience with each other.'},
  {type:'heading', text:'How Ratings Work'},
  {text:'After each help, you can rate the help seeker based on your experience.'},
  {text:'Help seekers also rate your support and behaviour.'},
  {text:'All ratings are visible on user profiles, helping everyone identify reliable and respectful members of the community.'},
  {text:'Honest ratings help maintain a safe, fair, and supportive environment for all.'},
  {type:'heading', text:'Ratings You Receive'},
  {text:'Your reliability, patience, and attitude play an important role in how help seekers rate your support.'},
  {text:'A good rating builds trust, increases your visibility, and improves your chances of being chosen for help requests.'},
  {type:'highlight', text:'Every star you earn is a mark of someone\'s gratitude.'},
  {type:'heading', text:'🏅 Rewards & Recognition'},
  {text:'Your ratings reflect your commitment to making a difference in someone\'s life.'},
  {text:'Consistent positive ratings can earn you special badges and recognition within the RACE Saathi community.'},
  {type:'certificate', text:'🎖️ Earn a RACE Saathi Certificate after completing 10 helps with a minimum rating of 4.5 stars — a proud recognition of your dedication and kindness.'},
  {type:'heading', text:'Impact of Low Ratings'},
  {text:'Low ratings over time may affect your visibility and reduce your chances of being selected for help requests.'},
  {text:'Repeated negative feedback may be reviewed by our team, and appropriate steps may be taken to maintain the quality and trust of the community.'},
];
const WHY_SEEKER = [
  {type:'intro', text:'You are not alone. RACE Saathi is here to make sure you always have someone to turn to.'},
  {text:'Get timely help and support whenever you need it.'},
  {text:'Build trust within the community, making it easier to connect and receive support when needed.'},
  {text:'Maintain a good rating from volunteers — it reflects your cooperation and increases your chances of receiving quicker and more willing support in the future.'},
  {text:'Feel more connected, supported, and less alone in your daily life.'},
  {text:'Gain confidence in seeking help without hesitation, knowing there are people around you who genuinely care.'},
  {text:'Be a valued and respected member of a caring community where people look out for each other.'},
  {type:'highlight', text:'You deserve support — and this community is here to provide it.'},
];
const WHY_HELPER = [
  {type:'intro', text:'Your time and effort can change someone\'s day — and sometimes, their life.'},
  {text:'Stay socially active and make a meaningful difference in the lives of those around you.'},
  {text:'Earn respect and recognition within your local community for your contribution and commitment.'},
  {text:'Build a strong and positive rating from help seekers, reflecting your reliability and trustworthiness.'},
  {type:'certificate', text:'🎖️ Receive a RACE Saathi Certificate that recognises your social contribution and adds value to your personal and professional profile.'},
  {text:'Experience a genuine sense of purpose and fulfilment by helping those who truly need it.'},
  {text:'Strengthen your communication, empathy, and people skills through real and meaningful interactions.'},
  {text:'Be part of a trusted network that supports senior citizens and others in need — and help build a community where no one feels alone.'},
  {type:'highlight', text:'Every act of help, no matter how small, leaves a lasting impression.'},
];
const TERMS_CONTENT = [
  {type:'intro', text:'RACE Saathi is a free, community-driven platform developed as a pilot project by Race Foundation, an NGO working towards community welfare. By using this platform, you agree to the following terms.'},
  {type:'heading', text:'1. About the Platform'},
  {text:'RACE Saathi connects senior citizens and individuals in need of help with volunteers willing to offer their time and support. The platform is currently operational as a pilot in Delhi, Gurgaon, and Noida only.'},
  {type:'heading', text:'2. Eligibility'},
  {text:'Any individual who wishes to seek or offer help may register on the platform. By registering, you confirm that the information provided by you is true and accurate to the best of your knowledge.'},
  {type:'heading', text:'3. No Monetary Transactions'},
  {text:'RACE Saathi is a completely free platform. No money, gifts, or payments of any kind should be exchanged between help seekers and volunteers. Race Foundation is not responsible for any financial transaction that takes place outside the platform.'},
  {type:'heading', text:'4. Volunteer Disclaimer'},
  {text:'Volunteers on this platform are community members and not trained professionals. Race Foundation does not guarantee the quality, outcome, or nature of any assistance provided. Help seekers are advised to use their judgement and take necessary precautions before accepting help.'},
  {type:'heading', text:'5. User Responsibilities'},
  {text:'Users are responsible for their own safety and conduct during any interaction. Users must behave respectfully and honestly at all times. Any misuse of the platform, including harassment, fraud, or misrepresentation, may result in removal from the platform.'},
  {type:'heading', text:'6. Ratings & Recognition'},
  {text:'The ratings system is designed to build community trust. Users are expected to provide honest and fair ratings. Misuse of the rating system may result in appropriate action by the platform.'},
  {type:'heading', text:'7. Platform Limitations'},
  {text:'RACE Saathi is currently in its pilot phase. Features, policies, and availability may change over time. Race Foundation reserves the right to modify, suspend, or discontinue any feature or service at any time without prior notice.'},
  {type:'heading', text:'8. Limitation of Liability'},
  {text:'Race Foundation and RACE Saathi are not liable for any loss, harm, injury, or dispute arising from interactions between users on the platform. Users engage with each other at their own discretion and risk.'},
  {type:'highlight', text:'For queries or feedback: saathi@racefoundation.in'},
];
const PRIVACY_CONTENT = [
  {type:'intro', text:'Race Foundation respects your privacy and is committed to protecting the personal information you share with us. This policy explains what data we collect, how we use it, and how we protect it.'},
  {type:'heading', text:'1. Data We Collect'},
  {text:'When you register and use RACE Saathi, we collect: Full Name, Phone Number, Age and Gender, City, Area and Pincode, Help requests you create or accept, Ratings given and received, and Emergency SOS contacts (for help seekers only).'},
  {type:'heading', text:'2. How We Use Your Data'},
  {text:'Your data is used solely for the purpose of operating the RACE Saathi platform — to create and manage your profile, connect help seekers with volunteers, display ratings, and maintain the safety and integrity of the platform.'},
  {type:'heading', text:'3. Data Sharing'},
  {text:'We do not sell, rent, or share your personal data with any third party for commercial purposes. Certain profile information such as your name, city, area, and rating may be visible to other users as part of the community experience.'},
  {type:'heading', text:'4. Emergency SOS Contacts'},
  {text:'SOS contact numbers entered by help seekers are stored securely and are visible only to the help seeker themselves. They are not shared with any other user or third party.'},
  {type:'heading', text:'5. Data Storage'},
  {text:'Your data is stored securely using Supabase, a trusted cloud database platform. We take reasonable measures to protect your data from unauthorised access.'},
  {type:'heading', text:'6. Data Deletion'},
  {text:'You may delete your account and all associated data at any time from within the app. Upon deletion, your profile, requests, ratings, and SOS contacts will be permanently removed from our system.'},
  {type:'heading', text:'7. Children\'s Privacy'},
  {text:'RACE Saathi is not intended for use by individuals under the age of 18. We do not knowingly collect data from minors.'},
  {type:'heading', text:'8. Changes to This Policy'},
  {text:'As RACE Saathi is currently in its pilot phase, this privacy policy may be updated from time to time. Users will be notified of significant changes through the app.'},
  {type:'highlight', text:'For privacy concerns: saathi@racefoundation.in'},
];

// ── INFO SCREEN ────────────────────────────────────────────
function InfoScreen({ navigate, userRole, prevScreen }) {
  const [activeTab, setActiveTab] = useState('terms');
  const isHelper = userRole === 'helper';
  const roleLabel = isHelper ? 'For Helpers (Volunteers)' : 'For Help Seekers';
  const roleIcon  = isHelper ? '🙋' : '👴';
  const tabs = [
    {key:'terms', label:'📄 T&C'}, {key:'safety', label:'🛡️ Safety'},
    {key:'ratings', label:'⭐ Ratings'}, {key:'interact', label:'💬 Interact'},
    {key:'why', label:'💡 Why'}, {key:'privacy', label:'🔒 Privacy'},
  ];
  const tabTitles = { safety:'🛡️ Safety & Security', interact:'💬 How to Interact', ratings:'⭐ Ratings & Rewards', why:'💡 Why It Matters', terms:'📄 Terms & Conditions', privacy:'🔒 Privacy Policy' };
  const activePoints =
    activeTab==='safety' ? (isHelper?SAFETY_HELPER:SAFETY_SEEKER) :
    activeTab==='interact' ? (isHelper?INTERACT_HELPER:INTERACT_SEEKER) :
    activeTab==='ratings' ? (isHelper?RATINGS_HELPER:RATINGS_SEEKER) :
    activeTab==='why' ? (isHelper?WHY_HELPER:WHY_SEEKER) :
    activeTab==='terms' ? TERMS_CONTENT : PRIVACY_CONTENT;

  const renderPoints = (points) => points.map((p,i) => {
    if (p.type==='heading') return <Text key={i} style={IS.subHeading}>{p.text}</Text>;
    if (p.type==='intro') return <View key={i} style={IS.pointRow}><View style={{width:7}}/><Text style={IS.pointIntro}>{p.text}</Text></View>;
    if (p.type==='highlight') return <View key={i} style={IS.highlightBox}><Text style={IS.highlightText}>{p.text}</Text></View>;
    if (p.type==='certificate') return <View key={i} style={IS.certBox}><Text style={IS.certText}>{p.text}</Text></View>;
    return <View key={i} style={IS.pointRow}><View style={IS.bullet}/><Text style={IS.pointText}>{p.text}</Text></View>;
  });

  return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={{paddingBottom:60}}>
      <View style={IS.header}>
        <Text style={IS.headerTitle}>Guidelines</Text>
        <Text style={IS.headerSub}>{activeTab==='terms'||activeTab==='privacy' ? '📋 Race Foundation · racefoundation.in' : `${roleIcon} ${roleLabel}`}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal:16, marginVertical:12}}>
        <View style={{flexDirection:'row', gap:8}}>
          {tabs.map(tab => (
            <TouchableOpacity key={tab.key} style={[IS.tab, activeTab===tab.key && IS.tabOn]} onPress={()=>setActiveTab(tab.key)}>
              <Text style={[IS.tabText, activeTab===tab.key && IS.tabTextOn]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={IS.contentCard}>
        <View style={IS.sectionBadge}><Text style={IS.sectionBadgeText}>{tabTitles[activeTab]}</Text></View>
        {renderPoints(activePoints)}
      </View>
      <TouchableOpacity onPress={()=>navigate(prevScreen)} style={IS.backBtn}>
        <Text style={IS.backBtnText}>← Back to Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── HOME SCREEN ────────────────────────────────────────────
function HomeScreen({ navigate, language, setLanguage }) {
  return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={S.homeContainer}>
      <StatusBar backgroundColor={C.navy} barStyle="light-content" />
      <View style={S.hero}>
        <Image source={{uri: LOGO_BASE64}} style={S.logoImage} resizeMode="cover" />
        <Text style={S.heroTitle}>RACE Saathi</Text>
        <Text style={S.heroTagline}>Helping Hands to Seniors</Text>
        <View style={S.heroDivider} />
        <Text style={S.heroHeading}>Help, Care & Everyday Support{'\n'}for Senior Citizens</Text>
        <View style={S.heroCityRow}>
          {['Delhi','Gurgaon','Noida'].map(c=>(
            <View key={c} style={S.heroCityChip}><Text style={S.heroCityText}>{c}</Text></View>
          ))}
        </View>
      </View>
      <View style={S.langRow}>
        {['en','hi'].map(l=>(
          <TouchableOpacity key={l} style={[S.langChip, language===l && S.langChipOn]} onPress={()=>setLanguage(l)}>
            <Text style={[S.langChipText, language===l && S.langChipTextOn]}>{l==='en'?'English':'हिन्दी'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={S.ctaRow}>
        <Btn style={S.ctaGreen} textStyle={S.ctaText} onPress={async()=>navigate('seeker_entry')}>I Need Help</Btn>
        <Btn style={S.ctaBlue} textStyle={S.ctaText} onPress={async()=>navigate('helper_entry')}>I Want to Help</Btn>
      </View>
      <View style={S.infoGrid}>
        {[
          {icon:'💛', text:'Connecting senior citizens with nearby helpers who genuinely care.'},
          {icon:'🤲', text:'Free, community-driven — no money involved, just people helping people.'},
          {icon:'⭐', text:'Build trust through ratings and grow as a caring community.'},
        ].map((item,i)=>(
          <View key={i} style={S.infoCard}>
            <Text style={S.infoIcon}>{item.icon}</Text>
            <Text style={S.infoText}>{item.text}</Text>
          </View>
        ))}
      </View>
      <Text style={S.footerText}>A small initiative to make everyday life a little easier for someone in need.</Text>
    </ScrollView>
  );
}

// ── REGISTRATION FORM ──────────────────────────────────────
function RegistrationForm({ title, hasWork, onSubmit, onBack }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [work, setWork] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [tcAccepted, setTcAccepted] = useState(true);
  return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={S.formScreen}>
      <View style={S.formHeader}><Text style={S.formTitle}>{title}</Text></View>
      <View style={S.formCard}>
        <Field label="Full Name" placeholder="Your full name" value={name} onChange={v=>setName(toTitleCase(v))} />
        <Field label="Phone Number" placeholder="10-digit phone number" value={phone} onChange={setPhone} keyboard="phone-pad" maxLen={10} />
        <Field label="Age" placeholder="Your age" value={age} onChange={setAge} keyboard="numeric" maxLen={3} />
        <GenderSelector selected={gender} onSelect={setGender} />
        {hasWork && <Field label="Work / Occupation" placeholder="e.g. Student, Teacher, Doctor" value={work} onChange={v=>setWork(toTitleCase(v))} />}
        <CitySelector selected={city} onSelect={setCity} label="City" />
        <Field label="Area / Locality" placeholder="Your area" value={area} onChange={v=>setArea(toTitleCase(v))} />
        <Field label="Pincode" placeholder="6-digit pincode" value={pincode} onChange={setPincode} keyboard="numeric" maxLen={6} />
        {/* T&C Checkbox */}
        <TouchableOpacity style={S.tcRow} onPress={()=>setTcAccepted(!tcAccepted)}>
          <View style={[S.tcBox, tcAccepted && S.tcBoxOn]}>
            {tcAccepted && <Text style={S.tcTick}>✓</Text>}
          </View>
          <Text style={S.tcText}>I have read and agree to the <Text style={{color:C.blue, fontWeight:'700'}}>Terms & Conditions</Text> and <Text style={{color:C.blue, fontWeight:'700'}}>Privacy Policy</Text></Text>
        </TouchableOpacity>
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={async()=>onSubmit({name,phone,age,gender,work,city,area,pincode})}>
          Register & Continue
        </Btn>
        <TouchableOpacity onPress={onBack} style={{marginTop:14,alignItems:'center'}}>
          <Text style={S.backLink}>← Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ── HELPER ENTRY ───────────────────────────────────────────
function HelperEntryScreen({ navigate, setCurrentUser, setUserRole }) {
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState('choice');

  const handleLogin = async () => {
    if (!phone.trim() || phone.length < 10) { Alert.alert('Please enter a valid 10-digit phone number'); return; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/helpers?phone=eq.${phone}&select=*`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    const data = await res.json();
    if (!data.length) { Alert.alert('No account found', 'Please register first.'); return; }
    await AsyncStorage.setItem('user_role', 'helper');
    await AsyncStorage.setItem('user_data', JSON.stringify(data[0]));
    setCurrentUser(data[0]); setUserRole('helper'); navigate('helper_profile');
  };

  const handleRegister = async (form) => {
    if (!form.phone||form.phone.length<10){Alert.alert('Please enter valid phone');return;}
    if (!form.name?.trim()){Alert.alert('Please enter your name');return;}
    if (!form.age?.trim()){Alert.alert('Please enter your age');return;}
    if (!form.gender){Alert.alert('Please select your gender');return;}
    if (!form.work?.trim()){Alert.alert('Please enter your occupation');return;}
    if (!form.city){Alert.alert('Please select your city');return;}
    if (!form.area?.trim()){Alert.alert('Please enter your area');return;}
    if (!form.pincode?.trim()){Alert.alert('Please enter pincode');return;}
    const chk = await fetch(`${SUPABASE_URL}/rest/v1/helpers?phone=eq.${form.phone}&select=id`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if ((await chk.json()).length) { Alert.alert('Account exists', 'Please login.'); setMode('login'); return; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/helpers`, {
      method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({name:form.name, phone:form.phone, age:form.age, gender:form.gender, work:form.work, city:form.city, area:form.area, pincode:form.pincode, rating:0, total_helps:0, available:true}),
    });
    const data = await res.json();
    await AsyncStorage.setItem('user_role', 'helper');
    await AsyncStorage.setItem('user_data', JSON.stringify(data[0]));
    setCurrentUser(data[0]); setUserRole('helper'); navigate('helper_profile');
  };

  if (mode==='choice') return (
    <View style={[S.centeredScreen,{backgroundColor:C.offWhite}]}>
      <View style={S.choiceCard}>
        <Text style={S.choiceTitle}>I Want to Help 🙋</Text>
        <Text style={S.choiceSub}>Do you have an account?</Text>
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={async()=>setMode('login')}>Login</Btn>
        <Btn style={[S.secondaryBtn,{marginTop:12}]} textStyle={S.secondaryBtnText} onPress={async()=>setMode('register')}>New Registration</Btn>
        <TouchableOpacity onPress={()=>navigate('home')} style={{marginTop:16,alignItems:'center'}}><Text style={S.backLink}>← Back to Home</Text></TouchableOpacity>
      </View>
    </View>
  );

  if (mode==='login') return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={S.formScreen}>
      <View style={S.formHeader}><Text style={S.formTitle}>Helper Login</Text></View>
      <View style={S.formCard}>
        <Field label="Phone Number" placeholder="10-digit phone number" value={phone} onChange={setPhone} keyboard="phone-pad" maxLen={10} />
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={handleLogin}>Login</Btn>
        <TouchableOpacity onPress={()=>setMode('choice')} style={{marginTop:14,alignItems:'center'}}><Text style={S.backLink}>← Back</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );

  return <RegistrationForm title="Helper Registration" hasWork onSubmit={handleRegister} onBack={()=>setMode('choice')} />;
}

// ── SEEKER ENTRY ───────────────────────────────────────────
function SeekerEntryScreen({ navigate, setCurrentUser, setUserRole }) {
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState('choice');

  const handleLogin = async () => {
    if (!phone.trim() || phone.length < 10) { Alert.alert('Please enter a valid 10-digit phone number'); return; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/seekers?phone=eq.${phone}&select=*`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    const data = await res.json();
    if (!data.length) { Alert.alert('No account found', 'Please register first.'); return; }
    await AsyncStorage.setItem('user_role', 'seeker');
    await AsyncStorage.setItem('user_data', JSON.stringify(data[0]));
    setCurrentUser(data[0]); setUserRole('seeker'); navigate('seeker_profile');
  };

  const handleRegister = async (form) => {
    if (!form.phone||form.phone.length<10){Alert.alert('Please enter valid phone');return;}
    if (!form.name?.trim()){Alert.alert('Please enter your name');return;}
    if (!form.age?.trim()){Alert.alert('Please enter your age');return;}
    if (!form.gender){Alert.alert('Please select your gender');return;}
    if (!form.city){Alert.alert('Please select your city');return;}
    if (!form.area?.trim()){Alert.alert('Please enter your area');return;}
    if (!form.pincode?.trim()){Alert.alert('Please enter pincode');return;}
    const chk = await fetch(`${SUPABASE_URL}/rest/v1/seekers?phone=eq.${form.phone}&select=id`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if ((await chk.json()).length) { Alert.alert('Account exists', 'Please login.'); setMode('login'); return; }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/seekers`, {
      method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({name:form.name, phone:form.phone, age:form.age, gender:form.gender, city:form.city, area:form.area, pincode:form.pincode, verified:false}),
    });
    const data = await res.json();
    await AsyncStorage.setItem('user_role', 'seeker');
    await AsyncStorage.setItem('user_data', JSON.stringify(data[0]));
    setCurrentUser(data[0]); setUserRole('seeker'); navigate('seeker_profile');
  };

  if (mode==='choice') return (
    <View style={[S.centeredScreen,{backgroundColor:C.offWhite}]}>
      <View style={S.choiceCard}>
        <Text style={S.choiceTitle}>I Need Help 🙏</Text>
        <Text style={S.choiceSub}>Do you have an account?</Text>
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={async()=>setMode('login')}>Login</Btn>
        <Btn style={[S.secondaryBtn,{marginTop:12}]} textStyle={S.secondaryBtnText} onPress={async()=>setMode('register')}>New Registration</Btn>
        <TouchableOpacity onPress={()=>navigate('home')} style={{marginTop:16,alignItems:'center'}}><Text style={S.backLink}>← Back to Home</Text></TouchableOpacity>
      </View>
    </View>
  );

  if (mode==='login') return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={S.formScreen}>
      <View style={S.formHeader}><Text style={S.formTitle}>Seeker Login</Text></View>
      <View style={S.formCard}>
        <Field label="Phone Number" placeholder="10-digit phone number" value={phone} onChange={setPhone} keyboard="phone-pad" maxLen={10} />
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={handleLogin}>Login</Btn>
        <TouchableOpacity onPress={()=>setMode('choice')} style={{marginTop:14,alignItems:'center'}}><Text style={S.backLink}>← Back</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );

  return <RegistrationForm title="Seeker Registration" hasWork={false} onSubmit={handleRegister} onBack={()=>setMode('choice')} />;
}

// ── EDIT PROFILE ───────────────────────────────────────────
function EditProfileScreen({ navigate, currentUser, setCurrentUser, userRole }) {
  const [phone, setPhone] = useState(currentUser.phone||'');
  const [age, setAge] = useState(currentUser.age||'');
  const [work, setWork] = useState(currentUser.work||'');
  const [city, setCity] = useState(currentUser.city||'');
  const [area, setArea] = useState(currentUser.area||'');
  const [pin, setPin] = useState(currentUser.pincode||'');
  const table = userRole==='helper'?'helpers':'seekers';

  const save = async () => {
    if (phone.length<10){Alert.alert('Please enter valid phone');return;}
    if (!age.trim()){Alert.alert('Please enter age');return;}
    if (!city){Alert.alert('Please select city');return;}
    if (!area.trim()){Alert.alert('Please enter area');return;}
    if (!pin.trim()){Alert.alert('Please enter pincode');return;}
    const phoneChanged = phone !== currentUser.phone;
    const payload = {phone, age, city, area:toTitleCase(area), pincode:pin, ...(userRole==='helper'?{work:toTitleCase(work)}:{})};
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${currentUser.id}`, { method:'PATCH', headers:{apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, 'Content-Type':'application/json', Prefer:'return=representation'}, body:JSON.stringify(payload) });
    if (phoneChanged) {
      Alert.alert('📱 Phone Changed', 'Your old number will no longer work. Please login with your new number.', [{text:'OK', onPress:async()=>{
        await AsyncStorage.removeItem('user_role'); await AsyncStorage.removeItem('user_data'); setCurrentUser(null); navigate('home');
      }}]);
    } else {
      const updated = {...currentUser,...payload};
      await AsyncStorage.setItem('user_data', JSON.stringify(updated)); setCurrentUser(updated);
      Alert.alert('Profile updated!'); navigate(userRole==='helper'?'helper_profile':'seeker_profile');
    }
  };

  const deleteAccount = async () => {
    if (userRole==='seeker') {
      await fetch(`${SUPABASE_URL}/rest/v1/help_requests?seeker_id=eq.${currentUser.id}`, {method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
      await fetch(`${SUPABASE_URL}/rest/v1/sos_contacts?seeker_id=eq.${currentUser.id}`, {method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    }
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${currentUser.id}`, {method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    await AsyncStorage.removeItem('user_role'); await AsyncStorage.removeItem('user_data');
    setCurrentUser(null); Alert.alert('Account deleted.'); navigate('home');
  };

  const confirmDelete = () => Alert.alert('⚠️ WARNING', 'All your ratings, helps and requests will be permanently deleted. Please take a screenshot first.', [
    {text:'Cancel',style:'cancel'},
    {text:'Yes, Delete My Account',style:'destructive', onPress:()=>Alert.alert('Are you sure?','This cannot be undone.',[
      {text:'Cancel',style:'cancel'},
      {text:'Yes, Delete',style:'destructive',onPress:deleteAccount},
    ])},
  ]);

  return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={S.formScreen}>
      <View style={S.formHeader}><Text style={S.formTitle}>Edit Profile</Text></View>
      <View style={S.formCard}>
        <Text style={S.fieldLabel}>Full Name</Text>
        <View style={S.lockedRow}><Text style={S.lockedVal}>{currentUser.name}</Text><Text>🔒</Text></View>
        <Text style={S.fieldLabel}>Gender</Text>
        <View style={S.lockedRow}><Text style={S.lockedVal}>{currentUser.gender}</Text><Text>🔒</Text></View>
        <Field label="Phone Number" placeholder="10-digit" value={phone} onChange={setPhone} keyboard="phone-pad" maxLen={10} />
        {phone !== currentUser.phone && <View style={S.warnBox}><Text style={S.warnText}>⚠️ Your old number will no longer work. Please login with your new number.</Text></View>}
        <Field label="Age" placeholder="Your age" value={age} onChange={setAge} keyboard="numeric" maxLen={3} />
        {userRole==='helper' && <Field label="Work / Occupation" placeholder="e.g. Teacher" value={work} onChange={v=>setWork(toTitleCase(v))} />}
        <CitySelector selected={city} onSelect={setCity} label="City" />
        <Field label="Area" placeholder="Your area" value={area} onChange={v=>setArea(toTitleCase(v))} />
        <Field label="Pincode" placeholder="6-digit" value={pin} onChange={setPin} keyboard="numeric" maxLen={6} />
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={save}>Save Changes</Btn>
        <TouchableOpacity onPress={()=>navigate(userRole==='helper'?'helper_profile':'seeker_profile')} style={{marginTop:14,alignItems:'center'}}>
          <Text style={S.backLink}>← Back</Text>
        </TouchableOpacity>
      </View>
      <View style={S.dangerZone}>
        <Btn style={S.dangerBtn} textStyle={S.dangerBtnText} onPress={confirmDelete}>🗑️ Delete Your Profile</Btn>
        <Text style={S.dangerTitle}>⚠️ WARNING</Text>
        <Text style={S.dangerDesc}>All your ratings, helps and requests will be permanently deleted. Please take a screenshot first.</Text>
      </View>
    </ScrollView>
  );
}

// ── SOS SCREEN ─────────────────────────────────────────────
function SOSScreen({ navigate, currentUser, setCurrentUser }) {
  const [fam, setFam] = useState([]);
  const [showFamForm, setShowFamForm] = useState(false);
  const [editFam, setEditFam] = useState(null);
  const [famName, setFamName] = useState('');
  const [famPhone, setFamPhone] = useState('');
  const [editSingle, setEditSingle] = useState(null);
  const [singName, setSingName] = useState('');
  const [singPhone, setSingPhone] = useState('');
  const [sd, setSd] = useState(currentUser);

  useEffect(()=>{loadFam();},[]);

  const loadFam = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sos_contacts?seeker_id=eq.${currentUser.id}&order=created_at.asc`, {headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    setFam((await res.json())||[]);
  };

  const call = (n) => Linking.openURL(`tel:${n}`);

  const saveFam = async () => {
    if (!famName.trim()){Alert.alert('Please enter name');return;}
    if (famPhone.length<10){Alert.alert('Please enter valid phone');return;}
    if (editFam) {
      await fetch(`${SUPABASE_URL}/rest/v1/sos_contacts?id=eq.${editFam.id}`, {method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({name:toTitleCase(famName),phone:famPhone})});
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/sos_contacts`, {method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({seeker_id:String(currentUser.id),label:'family',name:toTitleCase(famName),phone:famPhone})});
    }
    setFamName('');setFamPhone('');setShowFamForm(false);setEditFam(null);loadFam();
  };

  const delFam = (id) => Alert.alert('Delete?','Are you sure?',[
    {text:'Delete',style:'destructive',onPress:async()=>{await fetch(`${SUPABASE_URL}/rest/v1/sos_contacts?id=eq.${id}`,{method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});loadFam();}},
    {text:'Cancel',style:'cancel'},
  ]);

  const saveSingle = async (field) => {
    if (!singName.trim()){Alert.alert('Please enter name');return;}
    if (singPhone.length<10){Alert.alert('Please enter valid phone');return;}
    const nf = field+'_name';
    await fetch(`${SUPABASE_URL}/rest/v1/seekers?id=eq.${currentUser.id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({[field]:singPhone,[nf]:toTitleCase(singName)})});
    const upd={...sd,[field]:singPhone,[nf]:toTitleCase(singName)};
    setSd(upd);await AsyncStorage.setItem('user_data',JSON.stringify(upd));
    setEditSingle(null);setSingName('');setSingPhone('');
  };

  const delSingle = (field) => Alert.alert('Delete?','Are you sure?',[
    {text:'Delete',style:'destructive',onPress:async()=>{
      const nf=field+'_name';
      await fetch(`${SUPABASE_URL}/rest/v1/seekers?id=eq.${currentUser.id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({[field]:null,[nf]:null})});
      const upd={...sd,[field]:null,[nf]:null};setSd(upd);await AsyncStorage.setItem('user_data',JSON.stringify(upd));
    }},
    {text:'Cancel',style:'cancel'},
  ]);

  const missing = fam.length===0 || !sd.sos_neighbour;

  const renderSingle = (field, emoji, label) => {
    const nf = field+'_name';
    if (sd[field]) return (
      <View style={SS.card}>
        <View style={SS.cardLeft}><Text style={SS.emoji}>{emoji}</Text><View><Text style={SS.name}>{sd[nf]||label}</Text><Text style={SS.num}>{sd[field]}</Text></View></View>
        <View style={SS.actions}>
          <TouchableOpacity style={SS.callBtn} onPress={()=>call(sd[field])}><Text style={SS.callTxt}>📞 Call</Text></TouchableOpacity>
          <View style={SS.editDel}>
            <TouchableOpacity style={SS.editBtn} onPress={()=>{setEditSingle(field);setSingName(sd[nf]||'');setSingPhone(sd[field]);}}><Text>✏️</Text></TouchableOpacity>
            <TouchableOpacity style={SS.delBtn} onPress={()=>delSingle(field)}><Text>🗑️</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
    if (editSingle===field) return (
      <View style={SS.form}>
        <Field label="Name" placeholder={`e.g. My ${label}`} value={singName} onChange={v=>setSingName(toTitleCase(v))} />
        <Field label="Phone Number" placeholder="10-digit" value={singPhone} onChange={setSingPhone} keyboard="phone-pad" maxLen={10} />
        <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={async()=>saveSingle(field)}>Save Contact</Btn>
        <TouchableOpacity onPress={()=>{setEditSingle(null);setSingName('');setSingPhone('');}} style={{marginTop:10,alignItems:'center'}}><Text style={S.backLink}>Cancel</Text></TouchableOpacity>
      </View>
    );
    return (
      <TouchableOpacity style={SS.addBtn} onPress={()=>{setEditSingle(field);setSingName('');setSingPhone('');}}>
        <Text style={SS.addTxt}>+ Add Contact</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{backgroundColor:'#FFF5F5'}} contentContainerStyle={{paddingBottom:40}}>
      <View style={SS.header}><Text style={SS.headerTitle}>🚨 Emergency Contacts</Text><Text style={SS.headerSub}>Tap any contact to call immediately</Text></View>
      {missing && <View style={SS.warn}><Text style={SS.warnText}>⚠️ Please add Family & Neighbour contacts for your safety!</Text></View>}
      <View style={SS.card}>
        <View style={SS.cardLeft}><Text style={SS.emoji}>🚔</Text><View><Text style={SS.name}>Police</Text><Text style={SS.num}>112</Text></View></View>
        <TouchableOpacity style={SS.callBtn} onPress={()=>call('112')}><Text style={SS.callTxt}>📞 Call</Text></TouchableOpacity>
      </View>
      <Text style={SS.sectionTitle}>👨‍👩‍👧 Family</Text>
      {fam.length===0 && <Text style={SS.empty}>No family members added yet</Text>}
      {fam.map(c=>(
        <View key={c.id} style={SS.card}>
          <View style={SS.cardLeft}><Text style={SS.emoji}>👤</Text><View><Text style={SS.name}>{c.name}</Text><Text style={SS.num}>{c.phone}</Text></View></View>
          <View style={SS.actions}>
            <TouchableOpacity style={SS.callBtn} onPress={()=>call(c.phone)}><Text style={SS.callTxt}>📞 Call</Text></TouchableOpacity>
            <View style={SS.editDel}>
              <TouchableOpacity style={SS.editBtn} onPress={()=>{setEditFam(c);setFamName(c.name);setFamPhone(c.phone);setShowFamForm(true);}}><Text>✏️</Text></TouchableOpacity>
              <TouchableOpacity style={SS.delBtn} onPress={()=>delFam(c.id)}><Text>🗑️</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      {showFamForm && (
        <View style={SS.form}>
          <Field label="Name (e.g. Son - Rahul)" placeholder="e.g. Son - Rahul" value={famName} onChange={v=>setFamName(toTitleCase(v))} />
          <Field label="Phone Number" placeholder="10-digit" value={famPhone} onChange={setFamPhone} keyboard="phone-pad" maxLen={10} />
          <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={async()=>saveFam()}>Save Contact</Btn>
          <TouchableOpacity onPress={()=>{setShowFamForm(false);setEditFam(null);setFamName('');setFamPhone('');}} style={{marginTop:10,alignItems:'center'}}><Text style={S.backLink}>Cancel</Text></TouchableOpacity>
        </View>
      )}
      {!showFamForm && <TouchableOpacity style={SS.addBtn} onPress={()=>{setEditFam(null);setFamName('');setFamPhone('');setShowFamForm(true);}}><Text style={SS.addTxt}>+ Add Family Member</Text></TouchableOpacity>}
      <Text style={SS.sectionTitle}>🏘️ Neighbour</Text>{renderSingle('sos_neighbour','🏘️','Neighbour')}
      <Text style={SS.sectionTitle}>👫 Friend</Text>{renderSingle('sos_friend','👫','Friend')}
      <Text style={SS.sectionTitle}>👨‍⚕️ Doctor</Text>{renderSingle('sos_doctor','👨‍⚕️','Doctor')}
      <TouchableOpacity onPress={()=>navigate('seeker_profile')} style={{marginTop:24,alignItems:'center'}}><Text style={S.backLink}>← Back</Text></TouchableOpacity>
    </ScrollView>
  );
}

// ── HELPER PROFILE ─────────────────────────────────────────
function HelperProfileScreen({ navigate, currentUser, setCurrentUser, setUserRole, requests, refresh }) {
  const [ratingModal, setRatingModal] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);
  const [city, setCity] = useState(currentUser.city||CITIES[0]);
  const [sortBy, setSortBy] = useState('area');
  const [detailsModal, setDetailsModal] = useState(false);
  const [selReq, setSelReq] = useState(null);
  const [selSeeker, setSelSeeker] = useState(null);
  const [acceptedInfo, setAcceptedInfo] = useState({});
  const [available, setAvailable] = useState(currentUser.available !== false);

  const myAccepted  = requests.filter(r=>r.volunteer_id===parseInt(currentUser.id,10)&&r.status==='accepted');
  const myCompleted = requests.filter(r=>r.volunteer_id===parseInt(currentUser.id,10)&&r.status==='completed');
  const open = requests.filter(r=>r.status==='open'&&r.city===city);
  const urgOrd = {High:0,Medium:1,Normal:2};
  const sorted = [...open].sort((a,b)=>{
    const al = sortBy==='area'?(a.area?.toLowerCase()===currentUser.area?.toLowerCase()?0:1):(a.pincode===currentUser.pincode?0:1);
    const bl = sortBy==='area'?(b.area?.toLowerCase()===currentUser.area?.toLowerCase()?0:1):(b.pincode===currentUser.pincode?0:1);
    return al!==bl?al-bl:(urgOrd[a.urgency]??2)-(urgOrd[b.urgency]??2);
  });

  useEffect(()=>{
    const p = requests.find(r=>r.volunteer_id===parseInt(currentUser.id,10)&&r.status==='completed'&&r.helper_rated===false);
    if(p) setPendingRating(p);
  },[requests]);

  useEffect(()=>{
    myAccepted.forEach(async(req)=>{
      if(req.seeker_id && !acceptedInfo[req.seeker_id]){
        const res = await fetch(`${SUPABASE_URL}/rest/v1/seekers?id=eq.${req.seeker_id}&select=id,phone,name`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
        const d = await res.json();
        if(d.length) setAcceptedInfo(p=>({...p,[req.seeker_id]:d[0]}));
      }
    });
  },[myAccepted]);

  const logout = async()=>{await AsyncStorage.removeItem('user_role');await AsyncStorage.removeItem('user_data');setCurrentUser(null);setUserRole(null);navigate('home');};

  const toggleAvailable = async () => {
    const newVal = !available;
    setAvailable(newVal);
    await fetch(`${SUPABASE_URL}/rest/v1/helpers?id=eq.${currentUser.id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({available:newVal})});
    const updated = {...currentUser, available:newVal};
    await AsyncStorage.setItem('user_data', JSON.stringify(updated));
    setCurrentUser(updated);
  };

  const openDetails = async(req)=>{
    setSelReq(req);setSelSeeker(null);setDetailsModal(true);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/seekers?id=eq.${req.seeker_id}&select=name,age,gender,city,area`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    const d = await res.json();
    if(d.length) setSelSeeker(d[0]);
  };

  const acceptFromModal = async()=>{
    await fetch(`${SUPABASE_URL}/rest/v1/help_requests?id=eq.${selReq.id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({status:'accepted',volunteer_id:parseInt(currentUser.id,10)})});
    setDetailsModal(false);setSelReq(null);setSelSeeker(null);await refresh();
  };

  const complete = async(id)=>{
    await fetch(`${SUPABASE_URL}/rest/v1/help_requests?id=eq.${id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({status:'completed',helper_rated:false,seeker_rated:false,volunteer_id:parseInt(currentUser.id,10)})});
    await refresh();
    const req = requests.find(r=>r.id===id);
    if(req){setPendingRating({...req,status:'completed',helper_rated:false});setRatingModal(true);}
  };

  const submitRating = async(stars)=>{
    if(!pendingRating) return;
    await fetch(`${SUPABASE_URL}/rest/v1/help_requests?id=eq.${pendingRating.id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({seeker_rating:stars,helper_rated:true})});
    setRatingModal(false);setPendingRating(null);Alert.alert('Thank you for rating! 🙏');refresh();
  };

  return (
    <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={{paddingBottom:100}}>
      {pendingRating&&!ratingModal&&<RatingBanner onPress={()=>setRatingModal(true)}/>}
      <RatingModal visible={ratingModal} title="Rate the Senior" description="How was your experience with this senior?" onSubmit={submitRating} onSkip={()=>setRatingModal(false)} />
      <SeekerDetailsModal visible={detailsModal} request={selReq} seeker={selSeeker} onAccept={acceptFromModal} onClose={()=>{setDetailsModal(false);setSelReq(null);setSelSeeker(null);}} />

      {/* Profile Header */}
      <View style={S.profileHeader}>
        <View style={S.profileAvatarWrap}><Text style={S.profileAvatarText}>🙋</Text></View>
        <Text style={S.profileName}>{currentUser.name}</Text>
        <Text style={S.profileSub}>📞 {currentUser.phone}</Text>
        <Text style={S.profileSub}>🏙️ {currentUser.city} · 🏠 {currentUser.area} · 📮 {currentUser.pincode}</Text>
        <Text style={S.profileSub}>💼 {currentUser.work} · 👤 {currentUser.gender}, {currentUser.age} yrs</Text>

        {/* Availability Toggle */}
        <TouchableOpacity style={[S.availToggle, available?S.availOn:S.availOff]} onPress={toggleAvailable}>
          <Text style={S.availText}>{available?'🟢 Available':'🔴 Busy'}</Text>
        </TouchableOpacity>

        <View style={S.statsRow}>
          <StatBox value={`⭐ ${Number(currentUser.rating||0).toFixed(1)}`} label="Rating" />
          <StatBox value={currentUser.total_helps||0} label="Total Helps" />
        </View>
        <View style={{flexDirection:'row', gap:10, marginTop:14}}>
          <TouchableOpacity style={S.editBtn} onPress={()=>navigate('edit_profile')}><Text style={S.editBtnText}>✏️ Edit Profile</Text></TouchableOpacity>
          <TouchableOpacity style={[S.editBtn,{borderColor:C.gold,backgroundColor:'rgba(201,151,43,0.1)'}]} onPress={()=>navigate('info')}><Text style={[S.editBtnText,{color:C.gold}]}>📋 Guidelines</Text></TouchableOpacity>
        </View>
      </View>

      <View style={{padding:16}}>
        {/* City Filter */}
        <View style={S.filterCard}>
          <Text style={S.filterTitle}>🏙️ Filter By City</Text>
          <View style={S.cityRow}>
            {CITIES.map(c=>(
              <TouchableOpacity key={c} style={[S.cityChip, city===c&&S.cityChipOn]} onPress={()=>setCity(c)}>
                <Text style={[S.cityChipText, city===c&&S.cityChipTextOn]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[S.searchByRow,{marginTop:10}]}>
            {[['area','📍 Area'],['pincode','🔢 Pin Code']].map(([v,label])=>(
              <TouchableOpacity key={v} style={[S.sortChip,sortBy===v&&S.sortChipOn]} onPress={()=>setSortBy(v)}>
                <Text style={[S.sortChipText,sortBy===v&&S.sortChipTextOn]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <SectionHeader icon="📋" title={`Open Requests — ${city}`} />
        {sorted.length===0&&<Text style={S.emptyText}>No requests found in this city.</Text>}
        {sorted.map(req=>{
          const local = sortBy==='area'?req.area?.toLowerCase()===currentUser.area?.toLowerCase():req.pincode===currentUser.pincode;
          const urg = getUrgencyStyle(req.urgency);
          return (
            <TouchableOpacity key={req.id} style={[S.card,{borderLeftColor:urg.border}]} onPress={()=>openDetails(req)} activeOpacity={0.82}>
              {local&&<View style={S.nearBadge}><Text style={S.nearBadgeText}>📍 Near You</Text></View>}
              <View style={S.cardTop}>
                <View style={S.catBadge}><Text style={S.catBadgeText}>{getCategoryIcon(req.category)} {req.category}</Text></View>
                <View style={[S.urgBadge,{backgroundColor:urg.bg,borderColor:urg.border}]}><Text style={[S.urgBadgeText,{color:urg.text}]}>{urg.label}</Text></View>
              </View>
              {req.time_preference&&<Text style={S.timePref}>🕐 When: {req.time_preference}</Text>}
              <Text style={S.cardDesc}>{req.description}</Text>
              <Text style={S.cardTime}>Posted: {formatDateTime(req.created_at)}</Text>
              <Text style={S.tapHint}>👆 Tap to view details & accept</Text>
            </TouchableOpacity>
          );
        })}

        {myAccepted.length>0&&<>
          <SectionHeader icon="🔵" title="My Accepted Requests" />
          {myAccepted.map(req=>{
            const sk = acceptedInfo[req.seeker_id];
            const urg = getUrgencyStyle(req.urgency);
            return (
              <View key={req.id} style={[S.card,{borderLeftColor:'#1A3A6E'}]}>
                <View style={S.cardTop}>
                  <View style={S.catBadge}><Text style={S.catBadgeText}>{getCategoryIcon(req.category)} {req.category}</Text></View>
                  <View style={[S.urgBadge,{backgroundColor:urg.bg,borderColor:urg.border}]}><Text style={[S.urgBadgeText,{color:urg.text}]}>{urg.label}</Text></View>
                </View>
                {req.time_preference&&<Text style={S.timePref}>🕐 When: {req.time_preference}</Text>}
                <Text style={S.cardDesc}>{req.description}</Text>
                <Text style={S.cardTime}>Posted: {formatDateTime(req.created_at)}</Text>
                {sk&&(
                  <TouchableOpacity style={S.phoneBox} onPress={()=>Linking.openURL(`tel:${sk.phone}`)}>
                    <Text style={S.phoneBoxText}>📞 {sk.name}: {sk.phone}</Text>
                  </TouchableOpacity>
                )}
                <Btn style={S.greenBtn} textStyle={S.greenBtnText} onPress={async()=>complete(req.id)}>Mark Complete</Btn>
              </View>
            );
          })}
        </>}

        {myCompleted.length>0&&<>
          <SectionHeader icon="✅" title="Completed Helps" />
          {myCompleted.map(req=>(
            <View key={req.id} style={[S.card,{borderLeftColor:C.grey}]}>
              <View style={S.cardTop}>
                <View style={S.catBadge}><Text style={S.catBadgeText}>{getCategoryIcon(req.category)} {req.category}</Text></View>
                <Text style={[S.statusText,{color:C.grey}]}>✅ Completed</Text>
              </View>
              <Text style={S.cardDesc}>{req.description}</Text>
              {req.seeker_rating>0&&<Text style={S.ratingGiven}>Rated senior: {'★'.repeat(req.seeker_rating)}</Text>}
            </View>
          ))}
        </>}

        <Btn style={S.logoutBtn} textStyle={S.logoutBtnText} onPress={logout}>Logout</Btn>
      </View>
    </ScrollView>
  );
}

// ── SEEKER PROFILE ─────────────────────────────────────────
function SeekerProfileScreen({ navigate, currentUser, setCurrentUser, setUserRole, requests, refresh }) {
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('');
  const [urg, setUrg] = useState('');
  const [timePref, setTimePref] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [pendingRating, setPendingRating] = useState(null);
  const [helperInfo, setHelperInfo] = useState({});

  // FIX: Use String comparison for seeker_id
  const myId = parseInt(currentUser.id, 10);
  const mine = requests.filter(r => parseInt(r.seeker_id, 10) === myId);
  const completed = mine.filter(r=>r.status==='completed');
  const rated = mine.filter(r=>r.seeker_rating>0);
  const avgRating = rated.length?(rated.reduce((s,r)=>s+r.seeker_rating,0)/rated.length).toFixed(1):0;

  useEffect(()=>{
    const p = mine.find(r=>r.status==='completed'&&r.seeker_rated===false);
    if(p){setPendingRating(p);setRatingModal(true);}
  },[requests]);

  useEffect(()=>{
    mine.filter(r=>r.volunteer_id&&!helperInfo[r.volunteer_id]).forEach(async req=>{
      const res = await fetch(`${SUPABASE_URL}/rest/v1/helpers?id=eq.${req.volunteer_id}&select=id,name,phone`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
      const d = await res.json();
      if(d.length) setHelperInfo(p=>({...p,[req.volunteer_id]:d[0]}));
    });
  },[requests]);

  const logout = async()=>{await AsyncStorage.removeItem('user_role');await AsyncStorage.removeItem('user_data');setCurrentUser(null);setUserRole(null);navigate('home');};

  const submit = async()=>{
    if(!cat){Alert.alert('Please select a category');return;}
    if(!urg){Alert.alert('Please select urgency');return;}
    if(!desc.trim()){Alert.alert('Please enter description');return;}
    try {
      // Read fresh user data from AsyncStorage — guaranteed correct id
      const rawUser = await AsyncStorage.getItem('user_data');
      const freshUser = rawUser ? JSON.parse(rawUser) : currentUser;
      const seekerId = freshUser.id;

      if(!seekerId) {
        Alert.alert('Session error. Please logout and login again.');
        return;
      }

      const body = {
        category:        cat,
        description:     desc,
        urgency:         urg,
        status:          'open',
        city:            freshUser.city    || currentUser.city,
        area:            freshUser.area    || currentUser.area,
        pincode:         freshUser.pincode || currentUser.pincode,
        seeker_id:       parseInt(seekerId, 10),
        volunteer_id:    null,
        helper_rated:    false,
        seeker_rated:    false,
        helper_rating:   null,
        seeker_rating:   null,
        time_preference: timePref || null,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/help_requests`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(body),
      });
      const saved = await res.json();
      setDesc(''); setCat(''); setUrg(''); setTimePref(''); setShowForm(false);
      Alert.alert('Request submitted successfully!');
      await refresh();
    } catch(e) {
      console.log(e);
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  const deleteReq = (id) => Alert.alert('Delete Request','Are you sure?',[
    {text:'Delete',style:'destructive',onPress:async()=>{await fetch(`${SUPABASE_URL}/rest/v1/help_requests?id=eq.${id}`,{method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});refresh();}},
    {text:'Cancel',style:'cancel'},
  ]);

  const submitRating = async(stars)=>{
    if(!pendingRating) return;
    await fetch(`${SUPABASE_URL}/rest/v1/help_requests?id=eq.${pendingRating.id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({helper_rating:stars,seeker_rated:true})});
    if(pendingRating.volunteer_id){
      const hr = await (await fetch(`${SUPABASE_URL}/rest/v1/helpers?id=eq.${pendingRating.volunteer_id}&select=rating,total_helps`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}})).json();
      if(hr.length){
        const nh=(hr[0].total_helps||0)+1, nr=((hr[0].rating||0)*(hr[0].total_helps||0)+stars)/nh;
        await fetch(`${SUPABASE_URL}/rest/v1/helpers?id=eq.${pendingRating.volunteer_id}`,{method:'PATCH',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({rating:nr,total_helps:nh})});
      }
    }
    setRatingModal(false);setPendingRating(null);Alert.alert('Thank you for rating! 🙏');refresh();
  };

  return (
    <View style={{flex:1}}>
      <ScrollView style={{backgroundColor:C.offWhite}} contentContainerStyle={{paddingBottom:120}}>
        {pendingRating&&!ratingModal&&<RatingBanner onPress={()=>setRatingModal(true)}/>}
        <RatingModal visible={ratingModal} title="Rate the Helper" description="How was the help you received?" onSubmit={submitRating} onSkip={()=>setRatingModal(false)} />

        <View style={S.profileHeader}>
          <View style={S.profileAvatarWrap}><Text style={S.profileAvatarText}>👴</Text></View>
          <Text style={S.profileName}>{currentUser.name}</Text>
          <Text style={S.profileSub}>📞 {currentUser.phone}</Text>
          <Text style={S.profileSub}>🏙️ {currentUser.city} · 🏠 {currentUser.area} · 📮 {currentUser.pincode}</Text>
          <Text style={S.profileSub}>👤 {currentUser.gender}, {currentUser.age} yrs</Text>
          <View style={S.statsRow}>
            <StatBox value={mine.length} label="Requests" />
            <StatBox value={completed.length} label="Completed" />
            <StatBox value={`⭐ ${avgRating}`} label="Ratings" />
          </View>
          <View style={{flexDirection:'row', gap:10, marginTop:14}}>
            <TouchableOpacity style={S.editBtn} onPress={()=>navigate('edit_profile')}><Text style={S.editBtnText}>✏️ Edit Profile</Text></TouchableOpacity>
            <TouchableOpacity style={[S.editBtn,{borderColor:C.gold,backgroundColor:'rgba(201,151,43,0.1)'}]} onPress={()=>navigate('info')}><Text style={[S.editBtnText,{color:C.gold}]}>📋 Guidelines</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{padding:16}}>
          <Btn style={S.primaryBtn} textStyle={S.primaryBtnText} onPress={async()=>setShowForm(!showForm)}>
            {showForm?'✕ Cancel':'+ New Help Request'}
          </Btn>

          {showForm&&(
            <View style={S.requestForm}>
              {/* City auto from profile — no selector shown */}
              <View style={S.autoCityBox}>
                <Text style={S.autoCityLabel}>🏙️ City:</Text>
                <Text style={S.autoCityValue}>{currentUser.city}</Text>
              </View>

              <Text style={S.fieldLabel}>Select Category</Text>
              <View style={S.catRow}>
                {CATEGORIES.map(c=>(
                  <TouchableOpacity key={c} style={[S.catChip,cat===c&&S.catChipOn]} onPress={()=>setCat(c)}>
                    <Text style={[S.catChipText,cat===c&&S.catChipTextOn]}>{getCategoryIcon(c)} {c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={S.fieldLabel}>Select Urgency</Text>
              <View style={S.urgRow}>
                {[['Normal','🟢',C.green],['Medium','🟡','#D97706'],['High','🔴','#DC2626']].map(([v,em,col])=>(
                  <TouchableOpacity key={v} style={[S.urgChip,urg===v&&{backgroundColor:col,borderColor:col}]} onPress={()=>setUrg(v)}>
                    <Text style={[S.urgChipText,urg===v&&{color:'#fff'}]}>{em} {v}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={S.fieldLabel}>When do you need help?</Text>
              <View style={S.catRow}>
                {TIME_PREFS.map(tp=>(
                  <TouchableOpacity key={tp} style={[S.catChip,timePref===tp&&S.catChipOn]} onPress={()=>setTimePref(timePref===tp?'':tp)}>
                    <Text style={[S.catChipText,timePref===tp&&S.catChipTextOn]}>{tp}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput placeholder="Describe what help you need..." placeholderTextColor={C.grey} value={desc} onChangeText={setDesc} style={[S.textInput,{height:100,textAlignVertical:'top',marginTop:8}]} multiline />
              <Btn style={[S.primaryBtn,{marginTop:8}]} textStyle={S.primaryBtnText} onPress={submit}>Submit Request</Btn>
            </View>
          )}

          <SectionHeader icon="📋" title="My Requests" />
          {mine.length===0&&<Text style={S.emptyText}>You have no requests yet.</Text>}
          {mine.map(req=>{
            const urgS=getUrgencyStyle(req.urgency);
            const helper = helperInfo[req.volunteer_id];
            const statusColor=req.status==='open'?C.green:req.status==='accepted'?C.blueMid:C.grey;
            const statusLabel=req.status==='open'?'🟢 Open':req.status==='accepted'?'🔵 Accepted':'✅ Completed';
            return (
              <View key={req.id} style={[S.card,{borderLeftColor:urgS.border}]}>
                <View style={S.cardTop}>
                  <View style={S.catBadge}><Text style={S.catBadgeText}>{getCategoryIcon(req.category)} {req.category}</Text></View>
                  <Text style={[S.statusText,{color:statusColor}]}>{statusLabel}</Text>
                </View>
                <View style={[S.urgBadge,{backgroundColor:urgS.bg,borderColor:urgS.border,alignSelf:'flex-start',marginBottom:6}]}>
                  <Text style={[S.urgBadgeText,{color:urgS.text}]}>{urgS.label}</Text>
                </View>
                {req.time_preference&&<Text style={S.timePref}>🕐 When: {req.time_preference}</Text>}
                <Text style={S.cardDesc}>{req.description}</Text>
                <Text style={S.cardTime}>Posted: {formatDateTime(req.created_at)}</Text>
                {req.status==='accepted'&&helper&&(
                  <View style={S.acceptedBanner}>
                    <Text style={S.acceptedText}>🙋 Accepted by: {helper.name}</Text>
                    <TouchableOpacity onPress={()=>Linking.openURL(`tel:${helper.phone}`)}>
                      <Text style={[S.acceptedText,{color:C.green,marginTop:4}]}>📞 Call Helper: {helper.phone}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {req.status==='completed'&&req.helper_rating>0&&<Text style={S.ratingGiven}>Your rating: {'★'.repeat(req.helper_rating)}</Text>}
                {req.status==='open'&&(
                  <Btn style={S.deleteBtn} textStyle={S.deleteBtnText} onPress={async()=>deleteReq(req.id)}>🗑 Delete Request</Btn>
                )}
              </View>
            );
          })}

          <TouchableOpacity style={S.sosProfileBtn} onPress={()=>navigate('sos')}>
            <Text style={S.sosProfileBtnText}>🚨 Emergency SOS Contacts</Text>
          </TouchableOpacity>
          <Btn style={S.logoutBtn} textStyle={S.logoutBtnText} onPress={logout}>Logout</Btn>
        </View>
      </ScrollView>
      <FloatingSOS onPress={()=>navigate('sos')} />
    </View>
  );
}

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('loading');
  const [requests, setRequests] = useState([]);
  const [language, setLanguage] = useState('en');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/help_requests?order=created_at.desc`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
      const data = await res.json();
      const normalized = Array.isArray(data) ? data.map(r => ({
        ...r,
        seeker_id:   r.seeker_id   != null ? parseInt(r.seeker_id, 10)   : null,
        volunteer_id: r.volunteer_id != null ? parseInt(r.volunteer_id, 10) : null,
      })) : [];
      setRequests(normalized);
    } catch(e){console.log(e);}
  };

  useEffect(()=>{
    (async()=>{
      try {
        const role = await AsyncStorage.getItem('user_role');
        const ud   = await AsyncStorage.getItem('user_data');
        if(role&&ud){setUserRole(role);setCurrentUser(JSON.parse(ud));setScreen(role==='helper'?'helper_profile':'seeker_profile');}
        else setScreen('home');
      } catch{setScreen('home');}
    })();
    fetchRequests();
  },[]);

  if(screen==='loading') return (
    <View style={[S.centeredScreen,{backgroundColor:C.navy}]}>
      <Image source={{uri:LOGO_BASE64}} style={{width:100,height:100,marginBottom:16,borderRadius:50,overflow:'hidden'}} resizeMode="cover" />
      <Text style={{fontSize:28,fontWeight:'800',color:C.goldBr,letterSpacing:1}}>RACE Saathi</Text>
      <Text style={{color:C.goldLt,marginTop:6,fontSize:14}}>Loading...</Text>
    </View>
  );

  const cp = {navigate:setScreen,currentUser,setCurrentUser,setUserRole,requests,refresh:fetchRequests};
  if(screen==='home')           return <HomeScreen navigate={setScreen} language={language} setLanguage={setLanguage} />;
  if(screen==='helper_entry')   return <HelperEntryScreen navigate={setScreen} setCurrentUser={setCurrentUser} setUserRole={setUserRole} />;
  if(screen==='seeker_entry')   return <SeekerEntryScreen navigate={setScreen} setCurrentUser={setCurrentUser} setUserRole={setUserRole} />;
  if(screen==='helper_profile') return <HelperProfileScreen {...cp} />;
  if(screen==='seeker_profile') return <SeekerProfileScreen {...cp} />;
  if(screen==='edit_profile')   return <EditProfileScreen navigate={setScreen} currentUser={currentUser} setCurrentUser={setCurrentUser} userRole={userRole} />;
  if(screen==='sos')            return <SOSScreen navigate={setScreen} currentUser={currentUser} setCurrentUser={setCurrentUser} />;
  if(screen==='info')           return <InfoScreen navigate={setScreen} userRole={userRole} prevScreen={userRole==='helper'?'helper_profile':'seeker_profile'} />;
  return null;
}

// ══════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════
const S = StyleSheet.create({
  centeredScreen:{flex:1,justifyContent:'center',alignItems:'center',padding:24},
  homeContainer:{paddingBottom:40},
  formScreen:{padding:16,paddingBottom:60},
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.55)',justifyContent:'center',alignItems:'center',padding:20},
  hero:{backgroundColor:C.navy,paddingTop:48,paddingBottom:32,paddingHorizontal:20,alignItems:'center'},
  logoImage:{width:90,height:90,marginBottom:10,borderRadius:45,overflow:'hidden'},
  heroTitle:{fontSize:32,fontWeight:'900',color:C.goldBr,letterSpacing:1.5,marginBottom:4},
  heroTagline:{fontSize:14,color:C.goldLt,letterSpacing:0.5,marginBottom:16},
  heroDivider:{width:48,height:2,backgroundColor:C.gold,borderRadius:2,marginBottom:16},
  heroHeading:{fontSize:17,fontWeight:'700',color:'#E8EEF8',textAlign:'center',lineHeight:26,marginBottom:16},
  heroCityRow:{flexDirection:'row',gap:8},
  heroCityChip:{backgroundColor:'rgba(201,151,43,0.2)',borderWidth:1,borderColor:C.gold,paddingHorizontal:14,paddingVertical:5,borderRadius:20},
  heroCityText:{color:C.goldBr,fontWeight:'700',fontSize:13},
  langRow:{flexDirection:'row',justifyContent:'center',gap:12,marginTop:20,marginBottom:8},
  langChip:{paddingVertical:8,paddingHorizontal:22,borderRadius:24,borderWidth:1.5,borderColor:C.greyLt,backgroundColor:C.white},
  langChipOn:{backgroundColor:C.navy,borderColor:C.navy},
  langChipText:{fontWeight:'600',color:C.textSub,fontSize:14},
  langChipTextOn:{color:C.white},
  ctaRow:{flexDirection:'row',gap:12,paddingHorizontal:16,marginTop:16,marginBottom:8},
  ctaGreen:{flex:1,backgroundColor:C.green,paddingVertical:18,borderRadius:16,alignItems:'center',elevation:4},
  ctaBlue:{flex:1,backgroundColor:C.blue,paddingVertical:18,borderRadius:16,alignItems:'center',elevation:4},
  ctaText:{color:C.white,fontWeight:'800',fontSize:15},
  infoGrid:{padding:16,gap:10},
  infoCard:{backgroundColor:C.white,borderRadius:14,padding:14,flexDirection:'row',alignItems:'flex-start',gap:12,elevation:2},
  infoIcon:{fontSize:24},
  infoText:{flex:1,fontSize:14,color:C.textSub,lineHeight:20},
  footerText:{textAlign:'center',color:C.grey,fontSize:13,fontStyle:'italic',paddingHorizontal:24,paddingBottom:24,lineHeight:20},
  formHeader:{backgroundColor:C.navy,paddingTop:48,paddingBottom:24,paddingHorizontal:20},
  formTitle:{fontSize:22,fontWeight:'800',color:C.goldBr},
  formCard:{backgroundColor:C.white,margin:16,borderRadius:18,padding:18,elevation:3},
  fieldLabel:{fontSize:13,fontWeight:'700',color:C.blue,marginBottom:6,letterSpacing:0.3},
  textInput:{borderWidth:1.5,borderColor:C.greyLt,backgroundColor:C.offWhite,borderRadius:12,padding:13,fontSize:15,color:C.text,marginBottom:4},
  genderRow:{flexDirection:'row',gap:10,marginBottom:4},
  genderChip:{flex:1,paddingVertical:12,borderRadius:12,borderWidth:2,borderColor:C.greyLt,backgroundColor:C.white,alignItems:'center'},
  genderChipOn:{backgroundColor:C.blue,borderColor:C.blue},
  genderChipText:{fontWeight:'700',color:C.textSub,fontSize:14},
  genderChipTextOn:{color:C.white},
  cityRow:{flexDirection:'row',gap:8,flexWrap:'wrap',marginBottom:4},
  cityChip:{paddingVertical:9,paddingHorizontal:18,borderRadius:22,borderWidth:1.5,borderColor:C.greyLt,backgroundColor:C.white},
  cityChipOn:{backgroundColor:C.navy,borderColor:C.navy},
  cityChipText:{fontWeight:'700',color:C.textSub,fontSize:14},
  cityChipTextOn:{color:C.goldBr},
  primaryBtn:{backgroundColor:C.blue,paddingVertical:16,borderRadius:14,alignItems:'center',elevation:3,marginTop:4},
  primaryBtnText:{color:C.white,fontWeight:'800',fontSize:15},
  secondaryBtn:{backgroundColor:C.white,paddingVertical:16,borderRadius:14,alignItems:'center',borderWidth:2,borderColor:C.blue},
  secondaryBtnText:{color:C.blue,fontWeight:'700',fontSize:15},
  greenBtn:{backgroundColor:C.green,paddingVertical:12,borderRadius:12,alignItems:'center',marginTop:8},
  greenBtnText:{color:C.white,fontWeight:'700',fontSize:14},
  deleteBtn:{backgroundColor:'#FEE2E2',paddingVertical:10,paddingHorizontal:18,borderRadius:10,borderWidth:1,borderColor:'#FECACA',alignSelf:'flex-start',marginTop:6},
  deleteBtnText:{color:C.red,fontWeight:'700',fontSize:13},
  logoutBtn:{marginTop:12,backgroundColor:'#FEE2E2',paddingVertical:14,borderRadius:14,alignItems:'center',borderWidth:1,borderColor:'#FECACA'},
  logoutBtnText:{color:C.red,fontWeight:'700',fontSize:15},
  backLink:{color:C.blueMid,fontWeight:'600',fontSize:14},
  choiceCard:{backgroundColor:C.white,borderRadius:20,padding:28,width:'100%',elevation:4},
  choiceTitle:{fontSize:22,fontWeight:'800',color:C.navy,marginBottom:6,textAlign:'center'},
  choiceSub:{fontSize:14,color:C.grey,textAlign:'center',marginBottom:24},
  profileHeader:{backgroundColor:C.navy,paddingTop:48,paddingBottom:28,paddingHorizontal:20,alignItems:'center'},
  profileAvatarWrap:{width:72,height:72,borderRadius:36,backgroundColor:'rgba(201,151,43,0.2)',borderWidth:2,borderColor:C.gold,alignItems:'center',justifyContent:'center',marginBottom:10},
  profileAvatarText:{fontSize:38},
  profileName:{fontSize:22,fontWeight:'800',color:C.white,marginBottom:4},
  profileSub:{fontSize:13,color:C.goldLt,marginBottom:2},
  availToggle:{marginTop:12,paddingVertical:8,paddingHorizontal:20,borderRadius:20,borderWidth:1.5,borderColor:C.gold},
  availOn:{backgroundColor:'rgba(30,111,62,0.3)',borderColor:'#4CAF50'},
  availOff:{backgroundColor:'rgba(192,57,43,0.3)',borderColor:C.red},
  availText:{fontWeight:'700',color:C.white,fontSize:14},
  statsRow:{flexDirection:'row',gap:10,marginTop:14,flexWrap:'wrap',justifyContent:'center'},
  statBox:{alignItems:'center',backgroundColor:'rgba(255,255,255,0.1)',paddingVertical:10,paddingHorizontal:14,borderRadius:14,minWidth:90,borderWidth:1,borderColor:'rgba(201,151,43,0.3)'},
  statValue:{fontSize:18,fontWeight:'800',color:C.goldBr},
  statLabel:{fontSize:11,color:C.goldLt,marginTop:2,textAlign:'center'},
  editBtn:{backgroundColor:'rgba(201,151,43,0.15)',paddingVertical:8,paddingHorizontal:16,borderRadius:20,borderWidth:1,borderColor:C.gold},
  editBtnText:{color:C.goldBr,fontWeight:'700',fontSize:13},
  sectionHeader:{flexDirection:'row',alignItems:'center',marginBottom:10,marginTop:8},
  sectionHeaderBar:{width:4,height:18,backgroundColor:C.gold,borderRadius:2,marginRight:8},
  sectionHeaderText:{fontSize:15,fontWeight:'800',color:C.navy},
  filterCard:{backgroundColor:C.white,borderRadius:16,padding:14,marginBottom:16,elevation:2},
  filterTitle:{fontSize:13,fontWeight:'700',color:C.blue,marginBottom:10},
  searchByRow:{flexDirection:'row',gap:10},
  sortChip:{flex:1,paddingVertical:9,borderRadius:10,borderWidth:1.5,borderColor:C.greyLt,alignItems:'center',backgroundColor:C.white},
  sortChipOn:{backgroundColor:C.blue,borderColor:C.blue},
  sortChipText:{fontWeight:'600',color:C.textSub,fontSize:13},
  sortChipTextOn:{color:C.white},
  card:{backgroundColor:C.white,borderRadius:14,padding:14,marginBottom:12,elevation:2,borderLeftWidth:4},
  cardTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8},
  catBadge:{backgroundColor:C.blueLt,paddingHorizontal:10,paddingVertical:4,borderRadius:8},
  catBadgeText:{fontWeight:'700',fontSize:13,color:C.blue},
  urgBadge:{paddingHorizontal:10,paddingVertical:4,borderRadius:8,borderWidth:1,marginBottom:4},
  urgBadgeText:{fontSize:12,fontWeight:'700'},
  timePref:{fontSize:12,color:C.blueMid,fontWeight:'600',marginBottom:6},
  cardDesc:{color:C.textSub,fontSize:14,lineHeight:20,marginBottom:6},
  cardTime:{fontSize:11,color:C.grey,marginBottom:8},
  tapHint:{fontSize:12,color:C.gold,fontWeight:'600',fontStyle:'italic'},
  statusText:{fontWeight:'700',fontSize:13},
  nearBadge:{backgroundColor:C.greenLt,paddingHorizontal:8,paddingVertical:3,borderRadius:6,alignSelf:'flex-start',marginBottom:6},
  nearBadgeText:{color:C.green,fontWeight:'700',fontSize:12},
  acceptedBanner:{backgroundColor:C.blueLt,padding:10,borderRadius:10,marginBottom:8},
  acceptedText:{color:C.blue,fontWeight:'700',fontSize:13},
  ratingGiven:{color:C.gold,fontWeight:'700',fontSize:13,marginTop:4},
  phoneBox:{backgroundColor:C.greenLt,padding:10,borderRadius:10,marginBottom:8},
  phoneBoxText:{color:C.green,fontWeight:'700',fontSize:14},
  emptyText:{textAlign:'center',color:C.grey,fontSize:14,paddingVertical:16},
  requestForm:{backgroundColor:C.white,borderRadius:16,padding:14,marginBottom:16,marginTop:12,elevation:2},
  autoCityBox:{flexDirection:'row',alignItems:'center',backgroundColor:C.blueLt,padding:12,borderRadius:10,marginBottom:14},
  autoCityLabel:{fontSize:14,fontWeight:'700',color:C.blue,marginRight:8},
  autoCityValue:{fontSize:15,fontWeight:'800',color:C.navy},
  catRow:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:14},
  catChip:{paddingVertical:9,paddingHorizontal:14,borderRadius:10,borderWidth:1.5,borderColor:C.greyLt,backgroundColor:C.white},
  catChipOn:{backgroundColor:C.blue,borderColor:C.blue},
  catChipText:{fontWeight:'600',color:C.textSub,fontSize:13},
  catChipTextOn:{color:C.white},
  urgRow:{flexDirection:'row',gap:8,marginBottom:14},
  urgChip:{flex:1,paddingVertical:10,borderRadius:10,borderWidth:1.5,borderColor:C.greyLt,backgroundColor:C.white,alignItems:'center'},
  urgChipText:{fontWeight:'700',color:C.textSub,fontSize:13},
  sosProfileBtn:{backgroundColor:C.red,paddingVertical:16,borderRadius:14,alignItems:'center',marginBottom:12,marginTop:8,elevation:4},
  sosProfileBtnText:{color:C.white,fontWeight:'800',fontSize:15},
  floatSOS:{position:'absolute',bottom:24,right:20,backgroundColor:C.red,paddingVertical:13,paddingHorizontal:20,borderRadius:30,elevation:8},
  floatSOSText:{color:C.white,fontWeight:'800',fontSize:14},
  ratingCard:{backgroundColor:C.white,borderRadius:24,padding:28,width:'100%',alignItems:'center',elevation:12},
  ratingTitle:{fontSize:20,fontWeight:'800',color:C.navy,marginBottom:6,textAlign:'center'},
  ratingDesc:{fontSize:14,color:C.grey,marginBottom:20,textAlign:'center'},
  starsRow:{flexDirection:'row',gap:10,marginBottom:10},
  star:{fontSize:46,color:'#DDD'},
  starOn:{color:C.goldBr},
  ratingLabel:{fontSize:16,fontWeight:'700',color:C.textSub,marginBottom:20},
  skipText:{color:C.grey,fontSize:13,textDecorationLine:'underline'},
  ratingBanner:{backgroundColor:C.goldLt,padding:14,borderWidth:1,borderColor:C.gold},
  ratingBannerTitle:{fontSize:14,fontWeight:'800',color:C.gold,marginBottom:2},
  ratingBannerDesc:{fontSize:13,color:C.textSub,marginBottom:4},
  ratingBannerCta:{fontSize:13,fontWeight:'700',color:C.blue},
  detailsCard:{backgroundColor:C.white,borderRadius:24,padding:20,width:'100%',elevation:12,maxHeight:'88%'},
  detailsTitle:{fontSize:18,fontWeight:'800',color:C.navy,textAlign:'center',marginBottom:14,paddingBottom:14,borderBottomWidth:1,borderBottomColor:C.greyLt},
  detailsSection:{backgroundColor:C.offWhite,borderRadius:14,padding:14,marginBottom:12},
  detailsSectionLabel:{fontSize:13,fontWeight:'800',color:C.blue,marginBottom:10},
  detailsRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},
  detailsKey:{fontSize:13,color:C.grey,width:90},
  detailsVal:{fontSize:14,fontWeight:'600',color:C.text,flex:1},
  detailsBtnRow:{flexDirection:'row',gap:12,marginTop:6},
  detailsCloseBtn:{flex:1,paddingVertical:14,borderRadius:12,borderWidth:1.5,borderColor:C.greyLt,alignItems:'center'},
  detailsCloseTxt:{fontWeight:'700',color:C.grey,fontSize:15},
  detailsAcceptBtn:{flex:1,paddingVertical:14,borderRadius:12,backgroundColor:C.blue,alignItems:'center'},
  detailsAcceptTxt:{fontWeight:'800',color:C.white,fontSize:15},
  lockedRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:C.greyLt,padding:13,borderRadius:12,marginBottom:14},
  lockedVal:{fontSize:15,color:C.grey},
  warnBox:{backgroundColor:'#FEF3C7',borderRadius:10,padding:10,marginBottom:10,borderWidth:1,borderColor:'#FCD34D'},
  warnText:{color:'#92400E',fontSize:13,fontWeight:'500'},
  dangerZone:{margin:16,backgroundColor:'#FFF5F5',borderRadius:16,padding:16,borderWidth:1,borderColor:'#FECACA'},
  dangerBtn:{backgroundColor:C.red,paddingVertical:14,borderRadius:12,alignItems:'center',marginBottom:12},
  dangerBtnText:{color:C.white,fontWeight:'800',fontSize:15},
  dangerTitle:{fontSize:14,fontWeight:'800',color:C.red,marginBottom:6,textAlign:'center'},
  dangerDesc:{fontSize:13,color:C.textSub,lineHeight:20,textAlign:'center'},
  tcRow:{flexDirection:'row',alignItems:'flex-start',gap:10,marginBottom:16,padding:12,backgroundColor:C.blueLt,borderRadius:12,borderWidth:1,borderColor:C.greyLt},
  tcBox:{width:22,height:22,borderRadius:6,borderWidth:2,borderColor:C.blue,backgroundColor:C.white,alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1},
  tcBoxOn:{backgroundColor:C.blue,borderColor:C.blue},
  tcTick:{color:C.white,fontWeight:'900',fontSize:14},
  tcText:{flex:1,fontSize:13,color:C.textSub,lineHeight:20},
});

// ── SOS STYLES ─────────────────────────────────────────────
const SS = StyleSheet.create({
  header:{backgroundColor:C.red,paddingTop:48,paddingBottom:24,paddingHorizontal:20,alignItems:'center',borderBottomLeftRadius:24,borderBottomRightRadius:24,marginBottom:16},
  headerTitle:{fontSize:22,fontWeight:'800',color:C.white,marginBottom:4},
  headerSub:{fontSize:13,color:'#FFCCCC',textAlign:'center'},
  warn:{backgroundColor:'#FEF3C7',borderRadius:12,padding:12,marginHorizontal:16,marginBottom:12,borderWidth:1,borderColor:'#FCD34D'},
  warnText:{color:'#92400E',fontWeight:'600',fontSize:13,textAlign:'center'},
  sectionTitle:{fontSize:14,fontWeight:'800',color:C.red,marginBottom:8,marginTop:16,marginHorizontal:16},
  card:{backgroundColor:C.white,borderRadius:14,padding:14,marginBottom:10,marginHorizontal:16,elevation:2,flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderLeftWidth:4,borderLeftColor:C.red},
  cardLeft:{flexDirection:'row',alignItems:'center',gap:12,flex:1},
  emoji:{fontSize:28},
  name:{fontWeight:'700',fontSize:15,color:C.text},
  num:{fontSize:13,color:C.grey,marginTop:2},
  actions:{alignItems:'flex-end',gap:6},
  callBtn:{backgroundColor:C.red,paddingVertical:8,paddingHorizontal:14,borderRadius:8},
  callTxt:{color:C.white,fontWeight:'700',fontSize:13},
  editDel:{flexDirection:'row',gap:8},
  editBtn:{backgroundColor:C.blueLt,padding:6,borderRadius:6},
  delBtn:{backgroundColor:'#FEE2E2',padding:6,borderRadius:6},
  addBtn:{backgroundColor:'#FEE2E2',borderWidth:1.5,borderColor:C.red,borderRadius:12,padding:12,alignItems:'center',marginBottom:4,marginHorizontal:16},
  addTxt:{color:C.red,fontWeight:'700',fontSize:14},
  empty:{color:C.grey,fontSize:13,textAlign:'center',marginBottom:8,marginHorizontal:16},
  form:{backgroundColor:C.white,borderRadius:14,padding:14,marginBottom:10,marginHorizontal:16,elevation:2},
});

// ── INFO STYLES ────────────────────────────────────────────
const IS = StyleSheet.create({
  header:{backgroundColor:C.navy,paddingTop:48,paddingBottom:28,paddingHorizontal:20,alignItems:'center'},
  headerTitle:{fontSize:26,fontWeight:'900',color:C.goldBr,letterSpacing:1,marginBottom:6},
  headerSub:{fontSize:14,color:C.goldLt,fontWeight:'600'},
  tab:{paddingVertical:10,paddingHorizontal:18,borderRadius:11,alignItems:'center'},
  tabOn:{backgroundColor:C.navy},
  tabText:{fontWeight:'700',fontSize:13,color:C.grey},
  tabTextOn:{color:C.goldBr},
  contentCard:{backgroundColor:C.white,marginHorizontal:16,borderRadius:18,padding:18,elevation:2,marginBottom:8},
  sectionBadge:{backgroundColor:C.blueLt,borderRadius:10,paddingVertical:8,paddingHorizontal:14,marginBottom:16,alignSelf:'flex-start'},
  sectionBadgeText:{fontSize:13,fontWeight:'800',color:C.blue},
  pointRow:{flexDirection:'row',alignItems:'flex-start',marginBottom:14,gap:10},
  bullet:{width:7,height:7,borderRadius:4,backgroundColor:C.gold,marginTop:7,flexShrink:0},
  pointText:{flex:1,fontSize:14,color:C.textSub,lineHeight:22},
  pointIntro:{flex:1,fontSize:14,color:C.navy,fontWeight:'600',fontStyle:'italic',lineHeight:22},
  subHeading:{fontSize:14,fontWeight:'800',color:C.navy,marginTop:16,marginBottom:8,paddingLeft:4,borderLeftWidth:3,borderLeftColor:C.gold,paddingVertical:2},
  highlightBox:{backgroundColor:C.goldLt,borderRadius:12,padding:14,marginVertical:10,borderWidth:1,borderColor:C.gold},
  highlightText:{color:C.gold,fontWeight:'700',fontSize:14,fontStyle:'italic',lineHeight:22,textAlign:'center'},
  certBox:{backgroundColor:C.navy,borderRadius:14,padding:16,marginVertical:10},
  certText:{color:C.goldBr,fontWeight:'700',fontSize:14,lineHeight:22,textAlign:'center'},
  backBtn:{marginHorizontal:16,marginTop:8,backgroundColor:C.blueLt,paddingVertical:14,borderRadius:14,alignItems:'center',borderWidth:1,borderColor:C.blue},
  backBtnText:{color:C.blue,fontWeight:'700',fontSize:14},
});
