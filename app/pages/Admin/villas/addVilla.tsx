import { ArrowRight, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../../../../components/Form/FormInput';
import { FormSelect } from '../../../../components/Form/FormSelect';
import { FormTextarea } from '../../../../components/Form/FormTextarea';
import { ImagePicker } from '../../../../components/Form/ImagePicker';
import { LoadingSpinner } from '../../../../components/Form/LoadingSpinner';
import { TypeToggle } from '../../../../components/Form/TypeToggle';
import { FarmFormData, FarmType, Owner } from '../../../../types/index';

const owners: Owner[] = [
  { id: '1', name: 'أحمد محمد العلي' },
  { id: '2', name: 'خالد عبدالله السعيد' },
  { id: '3', name: 'فهد إبراهيم الأحمد' },
  { id: '4', name: 'محمد سعد الدوسري' },
];

export const AddFarmScreen: React.FC = () => {
  const [farmType, setFarmType] = useState<FarmType>('rent');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FarmFormData>({
    name: '',
    address: '',
    contact: '',
    size: '',
    salePrice: '',
    guests: '',
    bedrooms: '',
    bathrooms: '',
    midweekPrice: '',
    weekendPrice: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedOwner) {
      Alert.alert('خطأ', 'الرجاء اختيار صاحب المزرعة');
      return;
    }
    if (!formData.name.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال اسم المزرعة');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log({ owner: selectedOwner, type: farmType, ...formData, images: selectedImages });
      setIsSubmitting(false);
      Alert.alert('تم', 'تم إضافة المزرعة بنجاح! ✓');
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>
      {/* Header */}
      <View style={{ backgroundColor: '#2E7D32', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: 16, marginBottom: 16 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <ArrowRight color="white" size={20} />
          <Text style={{ color: 'white', marginLeft: 6 }}>رجوع</Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>إضافة مزرعة جديدة 🌴</Text>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>املأ البيانات لإضافة مزرعة جديدة</Text>
      </View>

      {/* Owner */}
      <Text style={{ fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 }}>اختر صاحب المزرعة</Text>
      <FormSelect
        label=""
        required
        value={selectedOwner}
        onChange={setSelectedOwner}
        options={[{ value: '', label: 'اختر المالك...' }, ...owners.map(o => ({ value: o.id, label: o.name }))]}
      />

      {/* Type Toggle */}
      <TypeToggle selected={farmType} onChange={setFarmType} />

      {/* Basic Info */}
      <FormInput label="اسم المزرعة" value={formData.name} onChange={text => setFormData({ ...formData, name: text })} required />
      <FormInput label="العنوان" value={formData.address} onChange={text => setFormData({ ...formData, address: text })} placeholder="المدينة، الحي" />
      <FormInput label="رقم التواصل" value={formData.contact} onChange={text => setFormData({ ...formData, contact: text })} placeholder="+966 5X XXX XXXX" />

      {/* Sale Fields */}
      {farmType === 'sale' && (
        <>
          <FormInput label="المساحة (هكتار)" value={formData.size} onChange={text => setFormData({ ...formData, size: text })} type="number" />
          <FormInput label="السعر (ريال)" value={formData.salePrice} onChange={text => setFormData({ ...formData, salePrice: text })} type="number" />
        </>
      )}

      {/* Villa Details */}
      <FormInput label="عدد الضيوف" value={formData.guests} onChange={text => setFormData({ ...formData, guests: text })} type="number" />
      <FormInput label="عدد الغرف" value={formData.bedrooms} onChange={text => setFormData({ ...formData, bedrooms: text })} type="number" />
      <FormInput label="عدد دورات المياه" value={formData.bathrooms} onChange={text => setFormData({ ...formData, bathrooms: text })} type="number" />

      {/* Rent Fields */}
      {farmType === 'rent' && (
        <>
          <FormInput label="سعر الليلة (أيام الأسبوع)" value={formData.midweekPrice} onChange={text => setFormData({ ...formData, midweekPrice: text })} type="number" />
          <FormInput label="سعر الليلة (نهاية الأسبوع)" value={formData.weekendPrice} onChange={text => setFormData({ ...formData, weekendPrice: text })} type="number" />
          <FormInput label="وقت بداية الحجز" value={formData.startTime} onChange={text => setFormData({ ...formData, startTime: text })} type="time" />
          <FormInput label="وقت نهاية الحجز" value={formData.endTime} onChange={text => setFormData({ ...formData, endTime: text })} type="time" />
        </>
      )}

      <FormTextarea value={formData.description} onChange={text => setFormData({ ...formData, description: text })} placeholder="أضف وصفاً مفصلاً عن المزرعة..." />

      {/* Images */}
      <View style={{ marginBottom: 16 }}>
        {selectedImages.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {selectedImages.map((img, i) => (
              <View key={i} style={{ position: 'relative', marginRight: 8 }}>
                <Image source={{ uri: img }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                <TouchableOpacity onPress={() => handleRemoveImage(i)} style={{ position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 12, padding: 2 }}>
                  <X color="white" size={16} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <ImagePicker imageCount={selectedImages.length} onImagesSelected={setSelectedImages} />
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={{
          backgroundColor: '#2E7D32',
          padding: 16,
          borderRadius: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          opacity: isSubmitting ? 0.5 : 1
        }}
      >
        {isSubmitting ? <LoadingSpinner /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>أضف المزرعة</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};
