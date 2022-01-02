use jaded::{AnnotationIter, ConversionResult, FromJava};

#[derive(Debug, FromJava, Clone)]
pub struct ArrayList<T: FromJava> {
    size: i32,
    #[jaded(extract(read_values))]
    pub list: Vec<T>,
}

fn read_values<T>(annotations: &mut AnnotationIter) -> ConversionResult<Vec<T>>
where
    T: FromJava,
{
    (0..annotations.read_i32()?)
        .into_iter()
        .map(|_| annotations.read_object_as())
        .collect()
}

impl<T: FromJava> From<ArrayList<T>> for Vec<T> {
    fn from(val: ArrayList<T>) -> Self {
        val.list
    }
}
